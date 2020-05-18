const notificationButton = document.getElementById('enableNotifications');
let swRegistration = null;

initializeApp();

function initializeApp() {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    console.log('Service Worker and Push is supported');

    //Register the service worker
    navigator.serviceWorker.register('./service-worker.js')
      .then(swReg => {
        console.log('Service Worker is registered', swReg);
        // We are storing the service worker, globally
        swRegistration = swReg;
        initializeUi();
      })
      .catch(error => {
        console.error('Service Worker Error', error);
      });
  } else {
    console.warn('Push messaging is not supported');
    notificationButton.textContent = 'Push Not Supported';
  }
}

function initializeUi() {
  notificationButton.addEventListener('click', () => {
    displayNotification();
  });
}

function displayNotification() {
  //Ask user if we show notifications
  if (window.Notification && Notification.permission === 'granted') {
    notification();
  }
  // If the user hasn't told whether he wants to be notified or not
  // Note: because of Chrome, we cannot be sure the permission property
  // is set, therefore it's unsafe to check for the "default" value.
  else if (window.Notification && Notification.permission !== 'denied') {
    Notification.requestPermission(status => {
      if (status === 'granted') {
        notification();
      } else {
        alert('You denied or dismissed permissions to notifications.');
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      'You denied permissions to notifications. Please go to your browser or phone setting to allow notifications.'
    );
  }
}

function notification() {
  const options = {
    body: 'Testing Our Notification',
    icon: './images/bell.png'
  };
  console.log('Show notification');
  swRegistration.showNotification('PWA Notification!', options);
}


