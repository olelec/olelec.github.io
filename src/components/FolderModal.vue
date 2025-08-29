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
      <div v-if="tree.length === 0">
        <br />
      </div>
      <n-tree
        block-line
        :data="tree"
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
          <n-button
            @click="downloadItems(false)"
            :disabled="checkedKeys.length !== 1"
            type="info"
            round
          >
            <n-icon> <Download /> </n-icon>
            Download
          </n-button>
          <n-button
            @click="downloadItems(true)"
            :disabled="checkedKeys.length !== 1"
            type="error"
            round
          >
            <n-icon> <file-pdf /> </n-icon>
            Download as PDF
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
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, h, defineProps, defineEmits, defineModel, ref } from "vue";
import type { TreeOption } from "naive-ui";
import { NIcon, useNotification, useLoadingBar } from "naive-ui";
import { FileExcel, FileWord, FilePdf, File, Download, Edit } from "@vicons/fa";
import { PreviewFilled } from "@vicons/material";
import { Folder, Cloud } from "@vicons/ionicons5";
import { DriveItem } from "../views/DocumentsView.vue";

export interface Directory {
  id: string;
  name: string;
  webUrl: string;
}

const notification = useNotification();
const loadingBar = useLoadingBar();

const props = defineProps<{
  folderContents: DriveItem[] | undefined;
  accessToken: string;
  directory: Directory | undefined;
}>();

const show = defineModel<boolean>("show");

const checkedKeys = ref<string[]>([]);
const previewUrl = ref<string>("");

const emit = defineEmits(["close"]);

const updateCheckedKeys = (keys: Array<string>) => {
  if (keys.length === 0) previewUrl.value = "";
  checkedKeys.value = keys.filter(
    (key) => !key.includes(props.directory?.id || "")
  );
};
const openWebEditor = () => {
  const files = checkedKeys.value;
  const selectedFile: any = props.folderContents?.find(
    (file: any) => file.id === files[0].split("--")[0]
  );
  const url = selectedFile.webUrl;

  open(url);
};
const downloadItems = async (pdf: boolean = false) => {
  loadingBar.start();
  const files = checkedKeys.value;

  try {
    const pdfPromises = files.map((file) => {
      const [fileId, fileName] = file.split("--");

      download(fileId, fileName, pdf);
    });
    await Promise.all(pdfPromises);
    loadingBar.finish();
    notification.success({
      content: "PDF downloaded successfully.",
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
const download = async (fileID: string, fileName: string, pdf: boolean) => {
  try {
    let format;
    if (fileName.includes(".pdf")) {
      format = "";
    } else if (pdf) {
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

// computed
const tree = computed<TreeOption[]>(() => {
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
});

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
