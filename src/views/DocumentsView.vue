<template>
  <div id="documents-view">
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
    <folder-modal
      v-model:show="showFolderModal"
      :folderContents="folderContents"
      :accessToken="accessToken"
      :directory="directory"
      @close="showFolderModal = false"
    />
    <n-float-button-group position="fixed" bottom="90px" right="30px">
      <n-float-button
        @click="fetchRAMsFiles"
        class="info"
        round
        width="4em"
        height="4em"
        :disabled="!isAuthenticated"
      >
        <n-spin v-if="spin" :show="spin" />
        <n-icon v-else size="2.5em">
          <Reload />
        </n-icon>
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

<script setup lang="ts">
import { PublicClientApplication } from "@azure/msal-browser";
import CreateRAMsModal from "@/components/CreateRAMsModal.vue";
import FolderModal from "@/components/FolderModal.vue";
import { Microsoft, Trash } from "@vicons/fa";
import { Reload, AddCircleOutline, Cloud, Folder } from "@vicons/ionicons5";
import { h, ref, computed, onMounted } from "vue";
import {
  NButton,
  NButtonGroup,
  NIcon,
  NBadge,
  NPopconfirm,
  useNotification,
  useLoadingBar,
} from "naive-ui";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);

const notification = useNotification();
const loadingBar = useLoadingBar();
const accessToken = ref("");
const isLoadingFiles = ref(false);
const RAMsID = ref("");
const accountId = ref("");
const accountName = ref("");
const isAuthenticated = ref(false);
const isLoadingLogin = ref(false);
const showModal = ref(false);
const showFolderModal = ref(false);
const spin = ref(false);
const RAMfiles = ref([]);
const rootFiles = ref([]);
const templateFiles = ref([]);
const folderContents = ref([]);
const directory = ref({});

const config = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: import.meta.env.VITE_AZURE_AUTHORITY,
    redirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};
const loginRequest = {
  scopes: ["User.Read", "Files.ReadWrite"],
};

let myMsal;

onMounted(async () => {
  config.auth.redirectUri = window.location.origin;
  myMsal = new PublicClientApplication(config);
  await initializeMsal();
  checkAccount();
});

const openFolder = async (folderID, folderName, webUrl) => {
  loadingBar.start();
  try {
    const files = await fetchFiles(folderID);
    directory.value.name = folderName;
    directory.value.id = folderID;
    directory.value.webUrl = webUrl;
    folderContents.value = files;
    showFolderModal.value = true;
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
    console.error("Error opening folder:", error);
    notification.error({
      content: "Error opening folder. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};
const fetchFiles = async (fileID) => {
  loadingBar.start();
  try {
    isLoadingFiles.value = true;

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/children`,
      {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      }
    );
    const data = await response.json();

    isLoadingFiles.value = false;
    loadingBar.finish();
    return data.value;
  } catch (error) {
    loadingBar.error();
    notification.error({
      content: "Error fetching files. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    console.error("Error fetching files:", error);
    isLoadingFiles.value = false;
  }
};

const initializeMsal = async () => {
  loadingBar.start();
  try {
    await myMsal.initialize();
    loadingBar.finish();
  } catch (error) {
    console.error("MSAL initialization failed", error);
    loadingBar.error();
  }
};
const login = async () => {
  isLoadingLogin.value = true;
  loadingBar.start();
  try {
    const loginResponse = await myMsal.loginPopup(loginRequest);
    accountId.value = loginResponse.account.homeAccountId;
    accountName.value = loginResponse.account.name;
    accessToken.value = loginResponse.accessToken;
    isAuthenticated.value = true;
    notification.success({
      content: "Welcome " + loginResponse.account.name,
      duration: 2500,
      keepAliveOnHover: true,
    });
    fetchRAMsFiles();
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
    console.error("Login failed:", error);
    notification.error({
      content: "Login failed. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  } finally {
    isLoadingLogin.value = false;
  }
};
const checkAccount = async () => {
  const accounts = myMsal.getAllAccounts();
  if (accounts.length > 0) {
    accountId.value = accounts[0].homeAccountId;
    accountName.value = accounts[0].name;
    accessToken.value = accounts[0].accessToken;
    isAuthenticated.value = true;
  }
};

const fetchTemplateFiles = async () => {
  loadingBar.start();
  try {
    if (rootFiles.value.length === 0) await fetchRootFiles();

    const templateDir = rootFiles.value.find(
      (item) => item.name === "Templates"
    );
    if (!templateDir) {
      throw new Error("Templates directory not found");
    }
    const templateDirID = templateDir.id;

    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${templateDirID}/children`,
      {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      }
    );
    const data = await response.json();

    const filteredFiles = data.value.filter((item) => {
      return item.name.includes(".");
    });
    templateFiles.value = filteredFiles;
    loadingBar.finish();
  } catch (error) {
    loadingBar.error();
    notification.error({
      content: "Error fetching files. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    console.error("Error fetching files:", error);
  }
};
const fetchRootFiles = async () => {
  if (!isAuthenticated.value) {
    console.error("User is not authenticated.");
    return;
  }
  if (!accessToken.value) {
    await login();
  }
  try {
    const rootResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/drive/root/children",
      {
        headers: { Authorization: `Bearer ${accessToken.value}` },
      }
    );
    const rootFilesData = await rootResponse.json();
    RAMsID.value = rootFilesData.value.find((item) => item.name === "RAMS").id;
    rootFiles.value = rootFilesData.value;
    return rootFiles.value;
  } catch (err) {
    notification.error({
      content: "Error fetching root files. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
    console.error("Error fetching root files:", err);
  }
};
const deleteItem = async (itemId) => {
  loadingBar.start();
  try {
    const response = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/items/${itemId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.value}`,
        },
      }
    );
    await response;
    notification.success({
      content: `Successfully deleted directory and its contents`,
      duration: 2500,
      keepAliveOnHover: true,
    });
    loadingBar.finish();
    if (!response.ok) {
      throw new Error("Error deleting file");
    }
    fetchRAMsFiles();
  } catch (error) {
    loadingBar.error();
    console.error("Error deleting:", error);
    notification.error({
      content: "Error deleting. Please try again.",
      duration: 2500,
      keepAliveOnHover: true,
    });
  }
};
const openModal = async () => {
  showModal.value = true;
  await fetchTemplateFiles(); // Fetch the template files
};
const fetchRAMsFiles = async () => {
  spin.value = true;
  if (rootFiles.value.length === 0) await fetchRootFiles();
  const allFiles = await fetchFiles(RAMsID.value);
  RAMfiles.value = allFiles.filter((item) => !item.name.includes("."));
  spin.value = false;
};
const open = (url) => {
  window.open(url, "_blank");
};
const nameToDate = (name) => {
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
  return parsableName + (count ? "(Ver. " + count + ")" : "");
};

const data = computed(() => {
  return RAMfiles.value.map((file) => ({
    name: file.name,
    friendlyName: nameToDate(file.name),
    lastModifiedDateTime: dayjs(file.lastModifiedDateTime),
    lastModifiedDateTimeFromNow: dayjs(file.lastModifiedDateTime).fromNow(),
    webUrl: file.webUrl,
    contentsCount: file.folder?.childCount,
    id: file.id,
  }));
});

const columns = computed(() => {
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
    },
    {
      title: "Last Modified",
      key: "lastModifiedDateTime",
      sorter: (a, b) =>
        dayjs(b.lastModifiedDateTime, "YYYY-MM-DDTHH:mm:ss").valueOf() -
        dayjs(a.lastModifiedDateTime, "YYYY-MM-DDTHH:mm:ss").valueOf(),
      defaultSortOrder: "ascend",
      render(row) {
        let tagValue = "";
        let tagType = "";
        const isNew = dayjs(row.lastModifiedDateTime).isAfter(
          dayjs().subtract(1, "day")
        );
        const isRecent = dayjs(row.lastModifiedDateTime).isAfter(
          dayjs().subtract(14, "day")
        );
        if (isNew) {
          tagValue = "New";
          tagType = "success";
        } else if (isRecent) {
          tagValue = "Recent";
          tagType = "info";
        }
        return isRecent
          ? h(NBadge, { value: tagValue, type: tagType }, [
              h("div", null, row.lastModifiedDateTimeFromNow),
            ])
          : h("div", null, row.lastModifiedDateTimeFromNow);
      },
    },

    {
      title: "Action",
      key: "actions",
      render(row) {
        return [
          h(NButtonGroup, [
            h(NBadge, { value: row.contentsCount, type: "info" }, [
              h(
                NButton,
                {
                  strong: true,
                  tertiary: true,
                  size: "small",
                  round: true,
                  type: "info",
                  secondary: true,
                  onClick: () => openFolder(row.id, row.name, row.webUrl),
                },
                {
                  default: () => [
                    h(NIcon, null, { default: () => h(Folder) }),
                    h("span", { style: { marginLeft: "0.25em" } }, "Open"),
                  ],
                }
              ),
            ]),
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
              {
                default: () => [
                  h(NIcon, null, { default: () => h(Cloud) }),
                  h("span", { style: { marginLeft: "0.25em" } }, "OneDrive"),
                ],
              }
            ),
            h(
              NPopconfirm,
              {
                onPositiveClick: () => deleteItem(row.id),
                onNegativeClick: () => console.log("Cancelled"),
                "positive-text": "Delete",
              },
              {
                trigger: () =>
                  h(
                    NButton,
                    {
                      strong: true,
                      tertiary: true,
                      size: "small",
                      round: true,
                      type: "error",
                      secondary: true,
                    },
                    {
                      default: () => [
                        h(NIcon, null, { default: () => h(Trash) }),
                        h(
                          "span",
                          { style: { marginLeft: "0.25em" } },
                          "Delete"
                        ),
                      ],
                    }
                  ),
                default: () =>
                  `Are you sure you want to delete the ${row.name} folder?`,
              }
            ),
          ]),
        ];
      },
    },
  ];
});
</script>

<style style="scss">
#documents-view {
  .n-button__content svg {
    width: 1em;
    margin-right: 0.5em;
  }
  .n-float-button.info,
  .n-base-loading .n-base-loading__container svg.n-base-loading__icon {
    background-color: #1890ff;
    color: white;
  }
}
</style>
