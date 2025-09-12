let messageApi = null;

export function setMessageApi(api) {
  messageApi = api;
}

export function showError(msg) {
  if (messageApi) {
    messageApi.error(msg);
  } else {
    // Fallback if AppProvider not mounted yet
    console.error('AntD message API not initialized:', msg);
  }
}

export function showWarning(msg) {
  if (messageApi) {
    messageApi.warning(msg);
  } else {
    // Fallback if AppProvider not mounted yet
    console.error('AntD message API not initialized:', msg);
  }
}

export function showSuccess(msg) {
  if (messageApi) {
    messageApi.success(msg);
  } else {
    console.log('SUCCESS:', msg);
  }
}

export function showInfo(msg) {
  if (messageApi) {
    messageApi.info(msg);
  } else {
    console.log('INFO:', msg);
  }
}
