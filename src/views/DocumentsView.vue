<template>
  <div>
    <n-data-table
      :columns="columns"
      :data="data"
      :maxHeight="1000"
      :minHeight="100"
    >
      <template #empty>
        <n-button-group>
          <n-button
            v-if="!isAuthenticated"
            @click="login"
            round
            :loading="isLoadingLogin"
            :disabled="isLoadingLogin"
          >
            <microsoft />
            Login with Microsoft
          </n-button>
          <n-button
            v-else
            @click="fetchRAMsFiles"
            type="info"
            :disabled="!isAuthenticated"
            :loading="isLoadingFiles"
          >
            Fetch Files
          </n-button>
        </n-button-group>
      </template>
    </n-data-table>
    <CreateRAMsModal
      :templateFiles="templateFiles"
      v-model:show="showModal"
      :RAMsID="RAMsID"
      :accessToken="accessToken"
      @create="
        showModal = false;
        fetchRAMsFiles();
      "
    />
    <n-float-button-group position="fixed" bottom="30px" right="30px">
      <n-float-button
        @click="fetchRAMsFiles"
        class="info"
        round
        width="4em"
        height="4em"
        :disabled="!isAuthenticated"
      >
        <n-icon size="2.5em"><Reload /></n-icon>
      </n-float-button>
      <n-float-button
        type="primary"
        @click="openModal"
        width="4em"
        height="4em"
        :disabled="!isAuthenticated"
      >
        <n-icon size="2.5em"><add-circle-outline /></n-icon>
      </n-float-button>
    </n-float-button-group>
  </div>
</template>

<script lang="ts">
import { PublicClientApplication } from "@azure/msal-browser";
import CreateRAMsModal from "@/components/CreateRAMsModal.vue";
import { Microsoft } from "@vicons/fa";
import { Reload, AddCircleOutline } from "@vicons/ionicons5";
import { h } from "vue";
import { dateArDZ, NButton, NButtonGroup, NIcon } from "naive-ui";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNotification, useLoadingBar } from "naive-ui";
import { access } from "fs";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite"],
};

export default {
  data() {
    return {
      myMsal: null,
      accountId: "",
      accountName: "",
      accessToken: "",
      isAuthenticated: false,
      isLoadingLogin: false,
      isLoadingFiles: false,
      showModal: false,
      RAMfiles: [],
      rootFiles: [],
      templateFiles: [],
      newFileTypes: [],
      projectName: "",
      dateForNewRAMs: undefined,
      config: {
        auth: {
          clientId: "4963f47c-b2e5-4c6e-a419-a5c79ba5a68a",
          authority:
            "https://login.microsoftonline.com/07e22eb9-ae7d-4de8-8781-9f9585b2f007",
          redirectUri: "",
        },
        cache: {
          cacheLocation: "sessionStorage", // or "localStorage"
          storeAuthStateInCookie: false,
        },
      },
    };
  },
  components: {
    Microsoft,
    Reload,
    AddCircleOutline,
    CreateRAMsModal,
  },
  setup() {
    const notification = useNotification();
    const loadingBar = useLoadingBar();
    return { notification, loadingBar };
  },
  methods: {
    async initializeMsal() {
      this.loadingBar.start();
      try {
        await this.myMsal.initialize();
        this.loadingBar.finish();
      } catch (error) {
        console.error("MSAL initialization failed", error);
        this.loadingBar.error();
      }
    },
    async login() {
      this.isLoadingLogin = true;
      this.loadingBar.start();
      try {
        const loginResponse = await this.myMsal.loginPopup(loginRequest);
        this.accountId = loginResponse.account.homeAccountId;
        this.accountName = loginResponse.account.name;
        this.accessToken = loginResponse.accessToken;
        this.isAuthenticated = true;
        this.notification.success({
          content: "Welcome " + loginResponse.account.name,
          duration: 2500,
          keepAliveOnHover: true,
        });
        this.fetchRAMsFiles();
        this.loadingBar.finish();
      } catch (error) {
        this.loadingBar.error();
        console.error("Login failed:", error);
        this.notification.error({
          content: "Login failed. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      } finally {
        this.isLoadingLogin = false;
      }
    },
    unixToDate(unix) {
      return dayjs.unix(unix / 1000).format("DD/MM/YYYY");
    },
    async checkAccount() {
      const accounts = this.myMsal.getAllAccounts();
      if (accounts.length > 0) {
        this.accountId = accounts[0].homeAccountId;
        this.accountName = accounts[0].name;
        this.accessToken = accounts[0].accessToken;
        this.isAuthenticated = true;
      }
    },
    async fetchFiles(fileID) {
      this.loadingBar.start();
      try {
        this.isLoadingFiles = true;

        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/children`,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        const data = await response.json();

        this.isLoadingFiles = false;
        this.loadingBar.finish();
        return data.value.filter((item) => !item.name.includes("."));
      } catch (error) {
        this.loadingBar.error();
        this.notification.error({
          content: "Error fetching files. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        console.error("Error fetching files:", error);
        this.isLoadingFiles = false;
      }
    },
    async fetchTemplateFiles() {
      this.loadingBar.start();
      try {
        if (this.rootFiles.length === 0) await this.fetchRootFiles();

        const templateDirID = this.rootFiles.find(
          (item) => item.name === "Templates"
        ).id;

        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${templateDirID}/children`,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        const data = await response.json();

        const filteredFiles = data.value.filter((item) => {
          return item.name.includes(".");
        });
        this.templateFiles = filteredFiles;
        this.loadingBar.finish();
      } catch (error) {
        this.loadingBar.error();
        this.notification.error({
          content: "Error fetching files. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        console.error("Error fetching files:", error);
      }
    },
    async fetchRootFiles() {
      if (!this.isAuthenticated) {
        console.error("User is not authenticated.");
        return;
      }
      if (!this.accessToken) {
        await this.login();
      }
      try {
        const rootResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me/drive/root/children",
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        const rootFiles = await rootResponse.json();
        this.RAMsID = rootFiles.value.find((item) => item.name === "RAMS").id;
        this.rootFiles = rootFiles.value;
        return rootFiles.value;
      } catch (err) {
        this.notification.error({
          content: "Error fetching root files. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        console.error("Error fetching root files:", err);
      }
    },
    async openModal() {
      this.showModal = true;
      await this.fetchTemplateFiles(); // Fetch the template files
    },
    async fetchRAMsFiles() {
      console.log("Fetching RAMs files");
      if (this.rootFiles.length === 0) await this.fetchRootFiles();
      this.RAMfiles = await this.fetchFiles(this.RAMsID);
    },
    fullFileName(fileName) {
      if (this.projectName === "") return fileName;
      const splitFileName = fileName.split(".");
      return (
        splitFileName[0] + " - " + this.projectName + "." + splitFileName[1]
      );
    },
    open(url) {
      window.open(url, "_blank");
    },
    nameToDate(name) {
      let parsableName = name;
      let count = 0;
      if (
        name.length === 9 ||
        name.length === 7 ||
        ((name.length === 10 || name.length === 8) && name.includes(" "))
      ) {
        parsableName = name.slice(0, -1).trimEnd();
        count = name.slice(-1);
      }
      if (parsableName.length === 8) {
        parsableName = dayjs(parsableName, "DDMMYYYY").format("DD/MMM/YYYY");
      } else if (parsableName.length === 6) {
        parsableName = dayjs(parsableName, "DDMMYY").format("DD/MMM/YYYY");
      }
      return `${parsableName} ${count ? `(Ver. ${count})` : ""}`;
    },
    async downloadPDFs(directoryID) {
      this.loadingBar.start();
      try {
        const files = await this.fetchFiles(directoryID);
        const pdfFiles = files.filter(
          (file) => file.name.includes(".docx") || file.name.includes(".xlsx")
        );
        console.log(pdfFiles);
        pdfFiles.forEach((file) => {
          // this.downloadPDF(file.id);
        });
      } catch (error) {
        this.loadingBar.error();
        console.error("Error downloading PDF:", error);
        this.notification.error({
          content: "Error downloading PDF. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
    },
    async downloadPDF(fileID: string) {
      this.loadingBar.start();
      try {
        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content?format=pdf`,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );

        if (!response.ok) {
          throw new Error("Error downloading PDF file");
        }

        this.loadingBar.finish();
        this.notification.success({
          content: "PDF downloaded successfully.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      } catch (error) {
        this.loadingBar.error();
        console.error("Error downloading PDF:", error);
        this.notification.error({
          content: "Error downloading PDF. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
    },
  },
  computed: {
    data() {
      return this.RAMfiles.map((file) => ({
        name: file.name,
        friendlyName: this.nameToDate(file.name),
        lastModifiedDateTime: `${dayjs(file.lastModifiedDateTime).fromNow()} `,
        webUrl: file.webUrl,
        id: file.id,
      }));
    },
    currentTime() {
      return dayjs().unix();
    },

    columns() {
      return [
        {
          title: "Directory Name",
          key: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "Friendly Name",
          key: "friendlyName",
          sorter: (a, b) =>
            dayjs(b.friendlyName.split(" ")[0], "DD/MMM/YYYY").valueOf() -
            dayjs(a.friendlyName.split(" ")[0], "DD/MMM/YYYY").valueOf(),
          defaultSortOrder: "ascend",
        },
        {
          title: "Last Modified",
          key: "lastModifiedDateTime",
          sorter: (a, b) =>
            dayjs(b.lastModifiedDateTime, "YYYY-MM-DDTHH:mm:ss").valueOf() -
            dayjs(a.lastModifiedDateTime, "YYYY-MM-DDTHH:mm:ss").valueOf(),
        },
        {
          title: "Action",
          key: "actions",
          render(row) {
            return [
              h(NButtonGroup, [
                h(
                  NButton,
                  {
                    strong: true,
                    tertiary: true,
                    size: "small",
                    round: true,
                    type: "info",
                    secondary: true,
                    onClick: () => open(row.webUrl),
                  },
                  { default: () => "Open in OneDrive" }
                ),
                h(
                  NButton,
                  {
                    strong: true,
                    tertiary: true,
                    size: "small",
                    round: true,
                    type: "error",
                    secondary: true,
                    onClick: () => downloadPDFs(row.id),
                  },
                  { default: () => "Download PDF" }
                ),
              ]),
            ];
          },
        },
      ];
    },
  },
  async created() {
    this.config.auth.redirectUri = window.location.origin;
    this.myMsal = new PublicClientApplication(this.config);
    await this.initializeMsal();
    this.checkAccount();
  },
};
</script>

<style scoped>
.n-button__content svg {
  width: 1em;
  margin-right: 0.5em;
}
.n-float-button.info {
  background-color: #1890ff;
  color: white;
}
#input-group {
  display: flex;
  align-items: center;
  gap: 0.5em;
  .n-input {
    width: 100%;
  }
  .n-date-picker {
    width: 36%;
  }
}
</style>
