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
      <template #footer>
        <n-alert title="Error" type="error" v-if="checkedKeys.length > 1">
          Please Download one at a time</n-alert
        >
        <br />
        <n-button-group>
          <n-button
            @click="downloadItems(false)"
            :disabled="checkedKeys.length !== 1"
            type="info"
          >
            <n-icon> <Download /> </n-icon>
            Download
          </n-button>
          <n-button
            @click="downloadItems(true)"
            :disabled="checkedKeys.length !== 1"
            type="error"
          >
            <n-icon> <file-pdf /> </n-icon>
            Download as PDF
          </n-button>
        </n-button-group>
      </template>
    </n-card>
  </n-modal>
</template>

<script setup lang="ts">
import { computed, h, defineProps, defineEmits, defineModel, ref } from "vue";
import type { TreeOption } from "naive-ui";
import { NIcon } from "naive-ui";
import { FileExcel, FileWord, FilePdf, File, Download } from "@vicons/fa";
import { Folder, Cloud } from "@vicons/ionicons5";
import { useNotification, useLoadingBar } from "naive-ui";

const notification = useNotification();
const loadingBar = useLoadingBar();

const props = defineProps({
  folderContents: {
    type: Array,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  directoryName: {
    type: String,
    required: true,
  },
});

const show = defineModel({
  prop: "show",
  event: "update:show",
});

const checkedKeys = ref<string[]>([]);

const emit = defineEmits(["close"]);

const updateCheckedKeys = (keys: Array<string>) => {
  checkedKeys.value = keys.filter((key) => key !== props.directoryName);
};
const downloadItems = async (pdf: boolean = false) => {
  loadingBar.start();
  const files = props.folderContents.filter(
    (file) => file.name !== props.directoryName
  );
  const pdfFiles = files.filter(
    (file) => file.name.includes(".docx") || file.name.includes(".xlsx")
  );
  try {
    const pdfPromises = pdfFiles.map((file) => {
      download(file.id, pdf);
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
const download = async (fileID: string, pdf: boolean) => {
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content${
        pdf ? "?format=pdf" : ""
      }`,
      {
        headers: { Authorization: `Bearer ${props.accessToken}` },
      }
    );
    const data = await response;
    open(data.url);
    if (!response.ok) {
      throw new Error("Error downloading PDF file");
    }
  } catch (error) {
    console.error("Error downloading PDF:", error);
    notification.error({
      content: "Error downloading PDF. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};
const open = (url) => {
  window.open(url, "_blank");
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
              label: props.directoryName,
              key: props.directoryName,
              checkboxDisabled: false,
              prefix: () => h(NIcon, null, { default: () => h(Folder) }),
              children: props.folderContents.map((file) => {
                const fileName = file.name;
                return {
                  label: fileName,
                  key: file.id,
                  prefix: () =>
                    h(NIcon, null, {
                      default: () =>
                        h(
                          fileName.includes(".xlsx")
                            ? FileExcel
                            : fileName.includes(".docx")
                            ? FileWord
                            : fileName.includes(".pdf")
                            ? FilePdf
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
  return ["oneDrive", "RAMS", props.directoryName];
});
</script>

<style scoped lang="scss">
.n-button .n-icon {
  margin-right: 0.5em;
}
</style>
