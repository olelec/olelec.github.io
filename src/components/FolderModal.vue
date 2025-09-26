<template>
  <n-modal v-model:show="show" id="folder-modal" :on-after-leave="closeModal">
    <n-card
      :style="
        previewUrl
          ? 'width: 80%; height: 90vh;'
          : 'width: 60em; min-height: 60vh'
      "
      :title="`Directory: ${props.directory?.name}`"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <div v-if="treeOptions.length === 0">
        <br />
      </div>
      <n-tree
        block-line
        :data="treeOptions"
        :default-expanded-keys="defaultExpandedKeys"
        expand-on-click
        cascade
        :checkable="true"
        @update:checked-keys="updateCheckedKeys"
      />
      <br />
      <div class="iframe-container">
        <iframe
          title="Preview"
          class="iframe-content"
          v-if="previewUrl"
          :src="previewUrl"
        />
      </div>

      <template #footer>
        <n-alert title="Error" type="error" v-if="checkedKeys.length > 1">
          Please Download one at a time</n-alert
        >
        <br />
        <n-button-group>
          <n-button
            @click="preview"
            :disabled="checkedKeys.length !== 1"
            type="primary"
            round
          >
            <n-icon> <preview-filled /> </n-icon>
            Preview
          </n-button>
          <n-button
            @click="openWebEditor()"
            :disabled="checkedKeys.length !== 1"
            type="info"
            tertiary
            round
          >
            <n-icon> <Edit /> </n-icon>
            Web Editor
          </n-button>
          <n-dropdown
            :options="options"
            trigger="click"
            placement="bottom-start"
            :render-icon="renderDropdownIcon"
            :render-label="renderDropdownLabel"
            @select="handleSelect"
          >
            <n-button :disabled="checkedKeys.length !== 1" type="info" round>
              <n-icon><Download /></n-icon>
              Download
            </n-button>
          </n-dropdown>
          <n-button @click="addFiles" type="error" round ghost>
            <n-icon> <Create /> </n-icon>
            Add New
          </n-button>
        </n-button-group>
        <n-button-group style="float: right">
          <n-button
            @click="open(directory?.webUrl || '')"
            type="info"
            tertiary
            round
          >
            <n-icon> <Cloud /> </n-icon>
            OneDrive
          </n-button>
        </n-button-group>
      </template>
      <CreateRAMsModal
        v-if="showModal"
        :accessToken="props.accessToken ?? ''"
        :destinationDirectoryId="props.directory?.id || ''"
        :newDirectoryCreated="false"
        v-model:show="showModal"
        @create="
          showModal = false;
          refreshFolderContents();
        "
      />
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import {
  computed,
  h,
  defineProps,
  defineEmits,
  defineModel,
  ref,
  watch,
  onBeforeMount,
} from "vue";
import type { DropdownOption, TreeOption } from "naive-ui";
import { NIcon, useNotification, useLoadingBar } from "naive-ui";
import { FileExcel, FileWord, FilePdf, File, Download, Edit } from "@vicons/fa";
import { PreviewFilled } from "@vicons/material";
import { Folder, Cloud, Create } from "@vicons/ionicons5";
import { DriveItem } from "../views/DocumentsView.vue";
import CreateRAMsModal from "./CreateRAMsModal.vue";

export interface Directory {
  id: string;
  name: string;
  webUrl: string;
}

onBeforeMount(() => {
  if (props.folderContents) {
    treeOptions.value = getTreeOptions();
  }
});

const notification = useNotification();
const loadingBar = useLoadingBar();

const props = defineProps<{
  folderContents: DriveItem[] | undefined;
  accessToken: string;
  directory: Directory | undefined;
}>();

const show = defineModel<boolean>("show");

const showModal = ref(false);
const checkedKeys = ref<string[]>([]);
const previewUrl = ref<string>("");
const treeOptions = ref<TreeOption[]>([]);

const emit = defineEmits(["close", "refresh"]);

const addFiles = () => {
  showModal.value = true;
};

const fileType = computed(() => {
  if (checkedKeys.value.length !== 1) return "";
  const key = checkedKeys.value[0];
  const fileName = key.split("--")[1] || "";
  return fileName.split(".").pop()?.toLowerCase() || "";
});

const options = computed(() => {
  if (checkedKeys.value.length !== 1) return [];
  const opts = [{ key: "original", label: "not used" }];
  if (fileType.value !== "pdf") {
    opts.push({ key: "pdf", label: "not used" });
  }
  return opts;
});

function renderDropdownIcon(option: DropdownOption) {
  if (option.key === "original") {
    return h(
      NIcon,
      { color: getFileIconColor(checkedKeys.value[0]) },
      { default: () => h(getFileIcon(checkedKeys.value[0])) }
    );
  } else if (option.key === "pdf") {
    return h(NIcon, { color: "#cc0000" }, { default: () => h(FilePdf) });
  }
  return null;
}

function renderDropdownLabel(option: DropdownOption) {
  if (option.key === "original") {
    return "Download " + fileType.value.toUpperCase();
  }
  if (option.key === "pdf") {
    return "Download PDF";
  }
  return null;
}

const handleSelect = (key: string) => {
  if (checkedKeys.value.length !== 1) return;
  downloadItems({ pdf: key === "pdf" });
};

const updateCheckedKeys = (keys: string[]) => {
  if (keys.length === 0) {
    previewUrl.value = "";
  }
  checkedKeys.value = keys.filter((key) => key !== props.directory?.id);
};

function refreshFolderContents() {
  emit("refresh");
}

const openWebEditor = () => {
  const files = checkedKeys.value;
  const selectedFile: any = props.folderContents?.find(
    (file: any) => file.id === files[0].split("--")[0]
  );
  const url = selectedFile.webUrl;

  open(url);
};
const downloadItems = async (options: { pdf: boolean }) => {
  loadingBar.start();
  const files = checkedKeys.value;

  try {
    const pdfPromises = files.map((file) => {
      const [fileId, fileName] = file.split("--");

      download(fileId, fileName, { pdf: options.pdf });
    });
    await Promise.all(pdfPromises);
    loadingBar.finish();
    notification.success({
      content: "Successfully downloaded file",
      duration: 2500,
      keepAliveOnHover: true,
    });
  } catch (error) {
    loadingBar.error();
    console.error("Error downloading PDFs:", error);
    notification.error({
      content: "Error downloading PDFs. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};
const download = async (
  fileID: string,
  fileName: string,
  options: { pdf: boolean }
) => {
  try {
    let format;
    if (fileName.includes(".pdf")) {
      format = "";
    } else if (options.pdf) {
      format = "?format=pdf";
    } else {
      format = "";
    }

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content${format}`,
      {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      }
    );

    if (!response.ok) {
      throw new Error("Error downloading file");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
    notification.error({
      content: "Error downloading file. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};

const preview = async () => {
  loadingBar.start();
  try {
    const fileID = checkedKeys.value[0].split("--")[0];
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/preview`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
      }
    );
    const data = await response.json();
    previewUrl.value = data.getUrl;
    loadingBar.finish();
    if (!response.ok) {
      throw new Error("Error previewing file");
    }
  } catch (error) {
    loadingBar.error();
    console.error("Error previewing:", error);
    notification.error({
      content: "Error previewing. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};
const open = (url: string | URL) => {
  window.open(url, "_blank");
};
const closeModal = () => {
  emit("close");
  previewUrl.value = "";
  checkedKeys.value = [];
};

const getTreeOptions = (): TreeOption[] => {
  return [
    {
      label: "OneDrive",
      key: "oneDrive",
      checkboxDisabled: true,
      prefix: () => h(NIcon, null, { default: () => h(Cloud) }),
      children: [
        {
          label: "RAMS",
          key: "RAMS",
          checkboxDisabled: true,
          prefix: () => h(NIcon, null, { default: () => h(Folder) }),
          children: [
            {
              label: props.directory?.name,
              key: props.directory?.id,
              checkboxDisabled: true,
              prefix: () => h(NIcon, null, { default: () => h(Folder) }),
              children: props.folderContents?.map((file) => {
                const fileName = file.name;
                return {
                  label: fileName,
                  key: `${file.id}--${fileName}`,
                  prefix: () =>
                    h(
                      NIcon,
                      { color: getFileIconColor(fileName) },
                      {
                        default: () => h(getFileIcon(fileName)),
                      }
                    ),
                };
              }),
            },
          ],
        },
      ],
    },
  ];
};

const getFileIcon = (fileName: string) => {
  if (fileName.includes(".xlsx")) return FileExcel;
  if (fileName.includes(".docx")) return FileWord;
  if (fileName.includes(".pdf")) return FilePdf;
  return File;
};

const getFileIconColor = (filename: string) => {
  if (filename.includes(".xlsx")) return "green";
  if (filename.includes(".docx")) return "#2B7CD3";
  if (filename.includes(".pdf")) return "#cc0000";
  return "";
};

const defaultExpandedKeys = computed(() => {
  return ["oneDrive", "RAMS", props.directory?.id];
});

watch(
  () => props.folderContents,
  (newVal) => {
    if (newVal) {
      treeOptions.value = getTreeOptions();
    }
  }
);
</script>

<style lang="scss">
#folder-modal {
  .n-card__content {
    display: flex;
    flex-direction: column;
  }

  .iframe-container {
    flex: 1;
    display: flex;
  }

  .iframe-content {
    width: 100%;
    height: 100%;
    flex: 1;
  }

  .n-button .n-icon {
    margin-right: 0.5em;
  }
}
</style>
