// src/renderer/services/notificationService.js
const { ipcRenderer } = window.require('electron');

export const showNotification = (title, body) => {
  ipcRenderer.send('show-notification', { title, body });
};