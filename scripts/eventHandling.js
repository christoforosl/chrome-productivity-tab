
import { getFocusHistoryData, showTimerData, updateTimerService, getTimerRecordFromStorage,onShowDSModal, deleteFocusData } from "./backgroundFocusTimer.js";
import { getElapsedTime, options, settings, $e } from "./common.js";
import { fetchImageFromApiService } from "./backgroundImage.js";

export function initializeEventHandlers() {
    if ($e("btnShowSettings")) {
        $e("btnShowSettings").addEventListener("click", function () {
            $("#settingsModal").modal("show");
        });
    }

    if ($e("btnSaveSettings")) {
        $e("btnSaveSettings").addEventListener("click", function () {
            if (!$("#greetingName").val()) {
                return;
            }

            let tmp = $("#backroundImageSearchTerms").val();
            if (!tmp) {
                tmp = "nature";
            }

            if (settings.imageKeywords !== tmp) {
                settings.imageKeywords = tmp;
                fetchImageFromApiService();
            }

            settings.greetingName = $("#greetingName").val();
            settings.daysToKeepImage = $("#daysToKeepImage").val();
            window.localStorage.setItem("settings", JSON.stringify(settings));
            $("#settingsModal").modal("hide");
        });
    }

    if ($e("btnShowHistory")) {
        $e("btnShowHistory").addEventListener("click", function () {
            getFocusHistoryData(function (data) {
                const $table = $("#tblFocusTimerHistory");
                data.forEach(function (obj) {
                    obj.endDateTime = obj.endTime ? new Date(obj.endTime).toLocaleString(options.language) : "";
                    obj.startDateTime = obj.startTime ? new Date(obj.startTime).toLocaleString(options.language) : "";
                    obj.workHours = getElapsedTime(obj.startTime, obj.endTime);
                });

                $table.bootstrapTable({ data: data });
                $table.bootstrapTable("load", data);
                $("#listTimersModal").modal("show");
            });
        });
    }

    if ($e("btnSaveFocusData")) {
        $e("btnSaveFocusData").addEventListener("click", function () {
            const timerRecord = {};

            timerRecord.timerId = $("#timerId").val();
            timerRecord._id = $("#timerId").val();

            if ($("#endDateTime").val()) {
                timerRecord.endTime = new Date($("#endDateTime").val()).getTime();
            }
            timerRecord.startTime = new Date($("#startDateTime").val()).getTime();
            timerRecord.focusTaskName = $("#focusTaskName").val();
            updateTimerService(timerRecord);

            const mode = $("#modal-mode").val();
            if (mode === "table-edit") {
                const $table = $("#tblFocusTimerHistory");
                $table.bootstrapTable("updateByUniqueId", {
                    id: timerRecord.timerId,
                    row: {
                        focusTaskName: timerRecord.focusTaskName,
                        endDateTime: timerRecord.endTime
                            ? new Date(timerRecord.endTime).toLocaleString(options.language)
                            : "",
                        startDateTime: timerRecord.startTime
                            ? new Date(timerRecord.startTime).toLocaleString(options.language)
                            : "",
                        workHours: getElapsedTime(timerRecord.startTime, timerRecord.endTime)
                    }
                });
            } else if (mode === "stop-timer-edit") {
                localStorage.removeItem("focusTimer");
            }

            $("#dateModal").modal("hide");
        });
    }

    if ($e("btnDeleteFocusData")) {
        $e("btnDeleteFocusData").addEventListener("click", function () {
            deleteFocusData();
        });
    }

    $("#workItemModal").on("show.bs.modal", function (event) {
        onShowDSModal();
    });

    $("#deleteEntryModal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget);
        const row = $("#tblFocusTimerHistory").bootstrapTable("getRowByUniqueId", button.data("rowid"));
        $("#DelfocusTaskName").html(row.focusTaskName);
        $("#DelEndDateTime").html(new Date(row.endTime).toLocaleString(options.language));
        $("#DelStartDateTime").html(new Date(row.startTime).toLocaleString(options.language));
        $("#DelTimerId").val(row._id);
    });

    $("#dateModal").on("show.bs.modal", function (event) {
        const button = $(event.relatedTarget);
        $("#modal-mode").val(button.data("modal-mode"));
        if (button.data("modal-mode") === "table-edit") {
            const row = $("#tblFocusTimerHistory").bootstrapTable("getRowByUniqueId", button.data("rowid"));
            showTimerData(row);
        } else if (button.data("modal-mode") === "stop-timer-edit") {
            console.log("calling endFocusTimer from dateModal");
            const timerRecord = getTimerRecordFromStorage();
            if (!timerRecord) {
                throw new Error("Error: no timer id");
            }
            let dnowWithSecs = new Date();
            dnowWithSecs = new Date(dnowWithSecs.setSeconds(0, 0));
            const dnow = dnowWithSecs.getTime();
            timerRecord.endTime = dnow;
            showTimerData(timerRecord);
        }
    });
}

export const operateEvents = {
    "click .timer-edit": function (e, value, row, index) {
        // leave here. if removed, javascript error appears in console
    },
    "click .timer-remove": function (e, value, row, index) { }
};

const getUniqueFocusTaskNames = (array) => {
    return Array.from(new Set(array.map(item => item.focusTaskName)));
};

const findItemByFocusTaskName = (array, focusTaskName) => {
    return array.find(item => item.focusTaskName === focusTaskName);
};
