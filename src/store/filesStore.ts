import { defineStore } from "pinia";
import { DriveItem } from "../views/DocumentsView.vue";

export const useFilesStore = defineStore("files", {
  state: () => ({
    templatesDirectoryID: "",
    templateFiles: [] as DriveItem[],
  }),
  getters: {
    getTemplatesDirectoryID: (state) => state.templatesDirectoryID,
    getTemplateFiles: (state) => state.templateFiles,
  },
  actions: {
    SET_TEMPLATES_DIRECTORY_ID(id: string) {
      this.templatesDirectoryID = id;
    },
    SET_TEMPLATE_FILES(files: DriveItem[]) {
      this.templateFiles = files;
    },
  },
});
