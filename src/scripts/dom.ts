/// <reference types="jquery" />

export interface ITimerRecord {
    focusTaskName:string;
}

export function $e(id:string): HTMLElement|null {
    if (typeof document !== 'undefined' && document.getElementById) {
        return document.getElementById(id);
    } else {
        return null;
    }
}

export function $html(id:string, text:string) {
    const elent = $e(id);
    if (elent) {
      if (elent.nodeName === 'DIV') {
        if (elent.innerHTML != text) {
          elent.innerHTML = text;
        }
      } else if (elent.nodeName === 'BUTTON') {
        if ((elent as HTMLInputElement).value != text) {
            (elent as HTMLInputElement).value = text;
        }
      }
    }
  }

export function hideItem(id:string) {
    $("#" + id).addClass("invisible");
    $("#" + id).css("display", "none");
}

export function showItem(id:string) {
    $("#" + id).removeClass("invisible");
    $("#" + id).css("display", "block");
}

export function noFocusTimerUI() {
    hideItem("divFocus");
    hideItem("divEndTimer");
    showItem("divAskAndSetGreeting");
    document.title = "Solid Focus";
}

export function setNotPausedTimerUI(timerRecord:ITimerRecord) {
    $html("currentFocus", "[" + timerRecord.focusTaskName + "]");
    $("#btnPauseFocusTimer").val ("Pause");
    $("#btnPauseFocusTimer").attr("title","Pause Current Focus Timer");
}

export function setPausedTimerUI(timerRecord:ITimerRecord) {
    $html("currentFocus", "[" + timerRecord.focusTaskName + " PAUSED ]");
    $("#btnPauseFocusTimer").val("Continue");
    $("#btnPauseFocusTimer").attr("title" , "Continue Task Timer");
}

export function withFocusTimerUI() {

    showItem("divFocus");
    showItem("divEndTimer");
    hideItem("divAskAndSetGreeting");

}
