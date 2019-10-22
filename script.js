const $provisionNumber = $('#provision_number');
const $configureWebhook = $('#configure_webhook');
const $apiUsername = $('#api_username');
const $apiPassword = $('#api_password');
const $accountId = $('#account_id');
const $realPhoneNumber = $('#real_phone_number');
const $webhookUrl = $('#webhook_pathname');
const $infoSection = $('#info_section');
const $virtualNumberText = $('#virtual_number_text');

const account = {
  virtualNumber: localStorage.getItem('virtual_number') || '' 
};

const API_URL = 'https://tadhack-berlin.herokuapp.com';

const internalApi = {
  api_url: 'https://markustoepfer.com:8080'
};

$accountId.val(localStorage.getItem('account_id'));
$realPhoneNumber.val(localStorage.getItem('real_phone_number'));
$apiUsername.val(localStorage.getItem('api_username'));
$apiPassword.val(localStorage.getItem('api_password'));

function saveToLocalStorage() {
  localStorage.setItem('account_id', getAccId());
  localStorage.setItem('real_phone_number', getRealPhoneNumber());
  localStorage.setItem('api_username', getApiUsername());
  localStorage.setItem('api_password', getApiPassword());
}

function getAccId() {
  return $accountId.val();
}

function getRealPhoneNumber() {
  return $realPhoneNumber.val();
}

function getApiUsername() {
  return $apiUsername.val();
}

function getApiPassword() {
  return $apiPassword.val();
}

function getAPIHeaders() {
  return {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Authorization': 'Basic ' + btoa(getApiUsername() + ":" + getApiPassword())
  };
}

function getWebhookPathnameAbsUrl() {
  return new URL($webhookUrl.val(), getApiConfig().api_url);
}

function getWebhookPathname() {
  const pathname = (new URL(getWebhookPathnameAbsUrl())).pathname;

  return pathname;
}

async function talkToInternalApi() {
  const apiConfig = getApiConfig();

  const options = {
    method: 'POST',
    headers: getAPIHeaders(),
    body: JSON.stringify({
      account_id: getAccId(),
      real_phone_number: getRealPhoneNumber(),
      virtual_number: account.virtualNumber,
      webhook_pathname: getWebhookPathname(),
      api_username: getApiUsername(),
      api_password: getApiPassword()
    })
  };

  await fetch(apiConfig.api_url + '/configure', options);
}

$provisionNumber.on('click', async function() {
  saveToLocalStorage();

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

  $virtualNumberText.text(account.virtualNumber);
  $infoSection.removeClass('hidden');
});

$configureWebhook.on('click', async function() {
  const accountId = getAccId();
  const options = {
    method: 'POST',
    headers: getAPIHeaders(),
    body: JSON.stringify({
      'account_id': accountId,
      number: account.virtualNumber,
      endpoint: getWebhookPathnameAbsUrl()
    })
  };

  const responseObject = await fetch(`${API_URL}/webhook`, options);
  const response = await responseObject.json();

  await talkToInternalApi();

  alert('Webhook configured!');
});
