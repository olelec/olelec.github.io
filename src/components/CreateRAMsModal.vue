<template>
  <n-modal v-model:show="show">
    <n-card
      style="width: 50em; min-height: 60vh"
      title="Create New RAMS"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      Date - Project Name
      <div id="input-group">
        <n-input-group>
          <n-date-picker
            v-model:value="dateForNewRAMs"
            type="date"
            format="dd/MM/yyyy"
            :status="dateWarning ? 'warning' : 'default'"
          />
          <n-input
            v-model:value="projectName"
            show-count
            placeholder="Project Name (Optional)"
          >
            <template #count="{ value }">
              <span
                :style="{ color: value.length > 15 ? 'orange' : 'inherit' }"
              >
                {{ `${value.length}/20` }}
              </span>
            </template>
          </n-input>
        </n-input-group>
      </div>

      <n-alert
        v-if="dateWarning"
        type="warning"
        title="Warning"
        style="margin: 0.5em"
      >
        The date you have selected is in the past. Please ensure this is
        correct.
      </n-alert>

      <br />
      Files Required
      <n-checkbox-group v-model:value="newFileTypes">
        <n-space item-style="display: flex;" style="flex-flow: column">
          <n-checkbox
            v-for="file in templateFiles"
            :key="file.id"
            :value="`${file.id}--${file.name}`"
            :label="file.name.split('.')[0]"
          />
        </n-space>
      </n-checkbox-group>

      <br />
      The following files will be created
      <div v-if="tree.length === 0">
        <br />
      </div>
      <n-tree
        block-line
        :data="tree"
        :default-expanded-keys="defaultExpandedKeys"
        expand-on-click
      />
      <template #footer>
        <n-button
          :disabled="newFileTypes.length === 0 || !dateForNewRAMs"
          @click="createNewRAMS"
          type="primary"
        >
          Create
        </n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, h, defineProps, defineEmits, defineModel, ref } from "vue";
import dayjs from "dayjs";
import type { TreeOption } from "naive-ui";
import { NIcon } from "naive-ui";
import { FileExcel, FileWord, File } from "@vicons/fa";
import { Folder, Cloud } from "@vicons/ionicons5";
import { useNotification, useLoadingBar } from "naive-ui";

const notification = useNotification();
const loadingBar = useLoadingBar();

const props = defineProps({
  templateFiles: {
    type: Array,
    required: true,
  },
  RAMsID: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
});

const show = defineModel({
  prop: "show",
  event: "update:show",
});

const emit = defineEmits(["createNewRAMS"]);

const dateForNewRAMs = ref<number | null>(null);
const projectName = ref<string>("");
const newFileTypes = ref<string[]>([]);

const dateWarning = computed(() => {
  return dateForNewRAMs.value
    ? dayjs.unix(dateForNewRAMs.value / 1000).isBefore(dayjs(), "day")
    : false;
});

const fullFileName = (name: string) => {
  if (!projectName.value) return name;
  const splitFileName = name.split(".");
  return `${splitFileName[0]} - ${projectName.value}.${splitFileName[1]}`;
};

const createNewRAMS = async () => {
  loadingBar.start();
  try {
    const newFolderResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/drive/items/" +
        props.RAMsID +
        "/children",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({
          name: dayjs.unix(dateForNewRAMs.value / 1000).format("DDMMYYYY"),
          folder: {},
          "@microsoft.graph.conflictBehavior": "rename", // Handle conflicts by renaming
        }),
      }
    );
    if (!newFolderResponse.ok) {
      throw new Error("Error creating new folder");
    }
    notification.success({
      content: "New folder created successfully.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    const newFolder = await newFolderResponse.json();
    const newFolderId = newFolder.id;

    const createFilePromises = newFileTypes.value.map((file) => {
      const [fileID, fileName] = file.split("--");
      copyFileToNewFolder(fileID, newFolderId, fileName);
    });

    await Promise.all([createFilePromises]);
    emit("create");
    const newFileNames = newFileTypes.value.map((file) =>
      fullFileName(file.split("--")[1])
    );
    notification.success({
      content: `New \n${newFileNames.join("\n")}\ncreated successfully.`,
      duration: 2500,
      keepAliveOnHover: true,
    });
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
    console.error("Error creating new RAMS directory:", error);
    notification.error({
      content: "Error creating new RAMS directory. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};

const copyFileToNewFolder = async (fileId, newFolderId, fileName) => {
  try {
    const copyResponse = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/copy`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({
          parentReference: {
            driveId: "me",
            id: newFolderId,
          },
          name: fullFileName(fileName),
        }),
      }
    );
    if (!copyResponse.ok) {
      throw new Error("Error creating new folder");
    }

    await copyResponse;
  } catch (error) {
    console.error("Error copying file:", error);
    notification.error({
      content: `Error creating file ${fileName}. Please try again.`,
      duration: 2500,
      keepAliveOnHover: true,
    });
    throw new Error("Error copying file");
  }
};

const tree = computed<TreeOption[]>(() => {
  if (!dateForNewRAMs.value || newFileTypes.value.length === 0) return [];

  const formattedDate = dayjs
    .unix(dateForNewRAMs.value / 1000)
    .format("DDMMYYYY");
  if (formattedDate === "Invalid Date") return [];

  return [
    {
      label: "OneDrive",
      key: "oneDrive",
      prefix: () => h(NIcon, null, { default: () => h(Cloud) }),
      children: [
        {
          label: "RAMS",
          key: "RAMS",
          prefix: () => h(NIcon, null, { default: () => h(Folder) }),
          children: [
            {
              label: formattedDate,
              key: formattedDate,
              prefix: () => h(NIcon, null, { default: () => h(Folder) }),
              children: newFileTypes.value.map((file) => {
                const fileName = fullFileName(file.split("--")[1]);
                return {
                  label: fileName,
                  key: file.split("--")[1],
                  prefix: () =>
                    h(NIcon, null, {
                      default: () =>
                        h(
                          fileName.includes(".xlsx")
                            ? FileExcel
                            : fileName.includes(".docx")
                            ? FileWord
                            : File
                        ),
                    }),
                };
              }),
            },
          ],
        },
      ],
    },
  ];
});

const defaultExpandedKeys = computed(() => {
  if (!dateForNewRAMs.value) return ["oneDrive", "RAMS"];
  return [
    "oneDrive",
    "RAMS",
    dayjs.unix(dateForNewRAMs.value / 1000).format("DDMMYYYY"),
  ];
});
</script>
