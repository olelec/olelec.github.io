<template>
  <n-modal v-model:show="show" :on-after-leave="closeModal">
    <n-card
      style="width: 50em; min-height: 60vh"
      :title="newDirectoryCreated ? 'Create New RAMS' : 'Add Files to Folder'"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <a v-if="newDirectoryCreated"> Directory Name </a>
      <div v-if="newDirectoryCreated" class="input-group">
        <n-date-picker
          v-model:value="dateForNewRAMs"
          type="date"
          format="ddMMyyyy"
          placeholder="RAMS Date"
          :status="dateWarning ? 'warning' : 'default'"
        />
      </div>
      <br />
      <a v-if="newDirectoryCreated"> File Name </a>
      <div v-if="newDirectoryCreated" class="input-group">
        <n-input-group>
          <n-input-group-label> Type </n-input-group-label>
          <n-input-group-label> - </n-input-group-label>
          <n-input
            id="location-input"
            v-model:value="projectLocation"
            show-count
            placeholder="Location (Optional)"
          >
            <template #count="{ value }">
              <span
                :style="{ color: value.length > 15 ? 'orange' : 'inherit' }"
              >
                {{ `${value.length}/20` }}
              </span>
            </template>
          </n-input>
          <n-input-group-label> - </n-input-group-label>
          <n-input
            id="name-input"
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
      <n-transfer
        v-model:value="newFileTypes"
        :options="options"
        :render-target-label="renderLabel"
        target-filter-placeholder="test"
        source-title="Template Files"
        target-title="Selected Files"
      />

      <br />

      <template #footer>
        <n-button
          :disabled="
            newFileTypes.length === 0 ||
            (!dateForNewRAMs && newDirectoryCreated)
          "
          @click="createNewRAMS"
          type="primary"
        >
          {{ newDirectoryCreated ? "Create" : "Add" }}
        </n-button>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, h, defineProps, defineEmits, defineModel, ref } from "vue";
import dayjs from "dayjs";
import { type TransferRenderTargetLabel, NIcon } from "naive-ui";
import { FileExcel, FileWord, File } from "@vicons/fa";
import { useNotification, useLoadingBar } from "naive-ui";
import { useFilesStore } from "../store/filesStore";
import { DriveItem } from "../views/DocumentsView.vue";

const notification = useNotification();
const filesStore = useFilesStore();
const loadingBar = useLoadingBar();

const props = defineProps<{
  destinationDirectoryId: string;
  accessToken: string;
  newDirectoryCreated?: boolean;
}>();

const templateFiles = computed(() => filesStore.getTemplateFiles);

const show = defineModel<boolean>("show");

const emit = defineEmits(["create", "close"]);

const dateForNewRAMs = ref<number | null>(null);
const projectName = ref<string>("");
const projectLocation = ref<string>("");
const newFileTypes = ref<string[]>([]);

const options = computed(() => {
  return templateFiles.value?.map((file) => {
    const value = `${file.id}--${file.name}`;
    const label = file.name.split(".")[0];
    return { value, label };
  });
});

const dateWarning = computed(() => {
  return dateForNewRAMs.value
    ? dayjs.unix(dateForNewRAMs.value / 1000).isBefore(dayjs(), "day")
    : false;
});

const closeModal = () => {
  dateForNewRAMs.value = null;
  projectName.value = "";
  projectLocation.value = "";
  newFileTypes.value = [];
  emit("close", false);
};

const fullFileName = (name: string) => {
  const [fileName, fileType] = name.split(".");
  let returnName = fileName;
  if (projectLocation.value) returnName += ` - ${projectLocation.value}`;
  if (projectName.value) returnName += ` - ${projectName.value}`;
  returnName += `.${fileType}`;
  return returnName;
};

const renderLabel: TransferRenderTargetLabel = ({ option }) => {
  // Determine file type
  const fileType = String(option.value).split(".").pop()?.toLowerCase();

  // Determine the appropriate icon for the file type
  let icon;
  let color;
  switch (fileType) {
    case "xlsx":
      icon = FileExcel;
      color = "green";
      break;
    case "docx":
      icon = FileWord;
      color = "#2B7CD3";
      break;
    default:
      icon = File;
      color = "";
  }

  return h(
    "div",
    {
      style: {
        display: "flex",
        margin: "6px 0",
      },
    },
    {
      default: () => [
        h(
          "div",
          {
            style: {
              display: "flex",
              marginLeft: "6px",
              alignSelf: "center",
            },
          },
          {
            default: () => [
              h(
                NIcon,
                { size: 18, style: { marginRight: "8px" }, color: color },
                { default: () => h(icon) }
              ),
              fullFileName(String(option.value).split("--")[1]),
            ],
          }
        ),
      ],
    }
  );
};

const createNewRAMS = async () => {
  loadingBar.start();
  try {
    let newFolderId = props.destinationDirectoryId;
    if (props.newDirectoryCreated) {
      const newFolderResponse = await fetch(
        "https://graph.microsoft.com/v1.0/me/drive/items/" +
          props.destinationDirectoryId +
          "/children",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.accessToken}`,
          },
          body: JSON.stringify({
            name: dayjs
              .unix(Number(dateForNewRAMs.value) / 1000)
              .format("DDMMYYYY"),
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
      newFolderId = newFolder.id;
    }

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

const copyFileToNewFolder = async (
  fileId: string,
  newFolderId: string,
  fileName: string
) => {
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

const fetchFiles = async (fileID: string): Promise<DriveItem[]> => {
  loadingBar.start();
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/children`,
      {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      }
    );
    const data = await response.json();

    if (!data.value) throw new Error("No files in response");

    const responseData = data.value as DriveItem[];

    if (!data) throw new Error(data.error);

    loadingBar.finish();
    return responseData;
  } catch (error) {
    loadingBar.error();
    notification.error({
      content: "Error fetching files. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    console.error("Error fetching files:", error);
    throw error;
  }
};
</script>

<style scoped style="scss">
.input-group {
  display: flex;
  align-items: center;
  gap: 0.5em;
  .n-input#name-input {
    width: 50%;
  }
  .n-input#location-input {
    width: 30%;
  }
  .n-date-picker {
    width: 36%;
  }
}
</style>
