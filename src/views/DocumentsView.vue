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
            @click="fetchRAMFiles"
            type="info"
            :disabled="!isAuthenticated"
            :loading="isLoadingRAMFiles"
          >
            Fetch Files
          </n-button>
        </n-button-group>
      </template>
    </n-data-table>
    <n-modal v-model:show="showModal">
      <n-card
        style="width: 600px"
        title="Create New RAMS"
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
      >
        Date
        <n-date-picker
          v-model:value="dateForNewRAMs"
          type="date"
          format="dd/MM/yyyy"
          :status="dateWarning ? 'warning' : 'default'"
        />
        <n-alert
          v-if="dateWarning"
          type="warning"
          title="Warning"
          style="margin: 0.5em"
        >
          The date you have selected is in the past. Please ensure this is
          correct.
        </n-alert>
        Files Required
        <n-checkbox-group v-model:value="newFileTypes">
          <n-space item-style="display: flex; " style="flex-flow: column">
            <n-checkbox
              v-for="file in templateFiles"
              :key="file.id"
              :value="`${file.id}--${file.name}`"
              :label="file.name.split('.')[0]"
            />
          </n-space>
        </n-checkbox-group>
        <template #header-extra> </template>
        <template #footer>
          <n-button
            :disabled="newFileTypes.length === 0 || !dateForNewRAMs"
            @click="createNewRAMS"
            >Create</n-button
          >
        </template>
      </n-card>
    </n-modal>
    <n-float-button-group position="fixed" bottom="30px" right="30px">
      <n-float-button
        @click="fetchRAMFiles"
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

<script>
import { PublicClientApplication } from "@azure/msal-browser";
import { Microsoft } from "@vicons/fa";
import { Reload, AddCircleOutline } from "@vicons/ionicons5";
import { h } from "vue";
import { NButton } from "naive-ui";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNotification, useLoadingBar } from "naive-ui";

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
      isLoadingRAMFiles: false,
      showModal: false,
      RAMfiles: [],
      rootFiles: [],
      templateFiles: [],
      newFileTypes: [],
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
        this.fetchRAMFiles();
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
    async fetchRAMFiles() {
      this.loadingBar.start();
      try {
        this.isLoadingRAMFiles = true;
        if (this.rootFiles.length === 0) await this.fetchRootFiles();
        const RAMSID = this.rootFiles.find((item) => item.name === "RAMS").id;

        const response = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${RAMSID}/children`,
          {
            headers: { Authorization: `Bearer ${this.accessToken}` },
          }
        );
        const data = await response.json();

        this.RAMfiles = data.value.filter((item) => !item.name.includes("."));
        this.isLoadingRAMFiles = false;
        this.loadingBar.finish();
      } catch (error) {
        this.loadingBar.error();
        this.notification.error({
          content: "Error fetching files. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        console.error("Error fetching files:", error);
        this.isLoadingRAMFiles = false;
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
        this.rootFiles = rootFiles.value;
        return rootFiles.value;
      } catch (err) {
        this.notification.error({
          content: "Error fetching root files. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        console.error("Error fetching root files:", error);
      }
    },
    async openModal() {
      this.showModal = true;
      await this.fetchTemplateFiles(); // Fetch the template files
    },
    async createNewRAMS() {
      this.loadingBar.start();
      try {
        const RAMSID = this.rootFiles.find((item) => item.name === "RAMS").id;
        const newFolderResponse = await fetch(
          "https://graph.microsoft.com/v1.0/me/drive/items/" +
            RAMSID +
            "/children",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.accessToken}`,
            },
            body: JSON.stringify({
              name: dayjs.unix(this.dateForNewRAMs / 1000).format("DDMMYYYY"),
              folder: {},
              "@microsoft.graph.conflictBehavior": "rename", // Handle conflicts by renaming
            }),
          }
        );
        if (!newFolderResponse.ok) {
          throw new Error("Error creating new folder");
        }
        this.notification.success({
          content: "New folder created successfully.",
          duration: 2500,
          keepAliveOnHover: true,
        });
        const newFolder = await newFolderResponse.json();
        const newFolderId = newFolder.id;

        // 3. Copy each template file to the new folder
        const newFileTypes = this.newFileTypes;
        const createFilePromises = newFileTypes.map((file) => {
          const [fileID, fileName] = file.split("--");
          this.copyFileToNewFolder(fileID, newFolderId, fileName);
        });

        await Promise.all([createFilePromises, await this.fetchRAMFiles()]);
        this.showModal = false;
        const newFileNames = newFileTypes.map((file) => file.split("--")[1]);
        this.notification.success({
          content: `New \n${newFileNames.join("\n")}\ncreated successfully.`,
          duration: 2500,
          keepAliveOnHover: true,
        });
        this.loadingBar.finish();
      } catch (error) {
        this.loadingBar.error();
        console.error("Error creating new RAMS directory:", error);
        this.notification.error({
          content: "Error creating new RAMS directory. Please try again.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
    },
    async copyFileToNewFolder(fileId, newFolderId, fileName) {
      try {
        const copyResponse = await fetch(
          `https://graph.microsoft.com/v1.0/me/drive/items/${fileId}/copy`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.accessToken}`,
            },
            body: JSON.stringify({
              parentReference: {
                driveId: "me",
                id: newFolderId,
              },
              name: fileName,
            }),
          }
        );
        if (!copyResponse.ok) {
          throw new Error("Error creating new folder");
        }

        await copyResponse;
      } catch (error) {
        console.error("Error copying file:", error);
        this.notification.error({
          content: `Error creating file ${fileName}. Please try again.`,
          duration: 2500,
          keepAliveOnHover: true,
        });
        throw new Error("Error copying file");
      }
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
  },
  computed: {
    data() {
      return this.RAMfiles.map((file) => ({
        name: file.name,
        friendlyName: this.nameToDate(file.name),
        lastModifiedDateTime: `${dayjs(file.lastModifiedDateTime).fromNow()} `,
        webUrl: file.webUrl,
      }));
    },
    currentTime() {
      return dayjs().unix();
    },
    dateWarning() {
      return dayjs(this.dateForNewRAMs).isBefore(dayjs().subtract(1, "day"));
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
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: "small",
                  round: true,
                  type: "info",
                  onClick: () => open(row.webUrl),
                },
                { default: () => "Open in OneDrive" }
              ),
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
</style>
