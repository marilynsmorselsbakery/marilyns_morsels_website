const defaultConsent = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  analytics_storage: 'denied',
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500
});`;

export default function ConsentDefaults() {
  return (
    <script
      id="analytics-consent-defaults"
      dangerouslySetInnerHTML={{ __html: defaultConsent }}
    />
  );
}
