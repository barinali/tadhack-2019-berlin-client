const $provisionNumber = $('#provision_number');
const $configureWebhook = $('#configure_webhook');
const $apiUsername = $('#api_username');
const $apiPassword = $('#api_password');
const $accountId = $('#account_id');
const $realPhoneNumber = $('#real_phone_number');
const $webhookUrl = $('#webhook_pathname');

const account = {
  virtualNumber: ''
};

const API_URL = "https://tadhack-berlin.herokuapp.com";

function getAccId() {
  return $accountId.val();
}

function getRealPhoneNumber() {
  return $realPhoneNumber.val();
}

function getAPIHeaders() {
  const username = $apiUsername.val();
  const password = $apiPassword.val(); 
  
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa(username + ":" + password)
  };
}

function getWebhookPathname() {
  const absoluteUrl = $webhookUrl.val();
  const pathname = (new URL(absoluteUrl)).pathname;

  return pathname;
}

function getProvisionNumberUrl(accountId, ) {
  return `${API_URL}/numbers/931218/allocated/447537149184/sms`;
}

$provisionNumber.on('click', async function() {
  const accountId = getAccId();
  const options = {
    method: 'POST',
    headers: getAPIHeaders(),
    body: JSON.stringify({
      'account_id': accountId
    })
  };

  const responseObject = await fetch(`${API_URL}/provision-number`, options);
  const response = await responseObject.json();

  account.virtualNumber = response.number;
  console.log(response);
});

$configureWebhook.on('click', async function() {
  const accountId = getAccId();
  let options = {
    method: 'POST',
    headers: getAPIHeaders(),
    body: JSON.stringify({
      'account_id': accountId,
      number: account.virtualNumber,
      endpoint: 'https://2bcb26fd.eu.ngrok.io/sms/incoming'
    })
  };

  let responseObject = await fetch(`${API_URL}/webhook`, options);
  let response = await responseObject.json();
  console.log(response);

  options = {
    method: 'POST',
    headers: getAPIHeaders(),
    body: JSON.stringify({
      account_id: accountId,
      endpoint: getWebhookPathname(),
      real_phone_number: getRealPhoneNumber(),
      virtual_number: account.virtualNumber,
      webhook_pathname: "/sample-webhook/calls"
    })
  };

  responseObject = await fetch(`https://markustoepfer.com:8080/configure`, options);
  response = await responseObject.json();
  console.log(response);
});
