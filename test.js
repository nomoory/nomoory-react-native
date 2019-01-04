it('works', () => {
    expect(1).toBe(1);
});

let staging = {
    "REACT_APP_DEV_API_ENDPOINT": "https://staging-api-vgeynb6vsktxpsc88j3qmmhjpwvncjge.coblic.com",
    "REACT_APP_DEV_API_VERSION": "v1.0",
    "REACT_APP_DEV_PUBNUB_SUBSCRIBE_KEY": "sub-c-17e69c14-c2db-11e8-ab1e-765c49db24ca",
    "REACT_APP_DEV_RECAPTCHA_SITE_KEY": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    "REACT_APP_DEV_ASSET_ORIGIN": ""
};

let dev = {
    "REACT_APP_DEV_API_ENDPOINT": "http://192.168.1.46",
    "REACT_APP_DEV_API_VERSION": "v1.0",
    "REACT_APP_DEV_PUBNUB_SUBSCRIBE_KEY": "sub-c-1042106a-c2db-11e8-9aa0-964870cc80a2",
    "REACT_APP_DEV_RECAPTCHA_SITE_KEY": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    "REACT_APP_DEV_ASSET_ORIGIN": ""
};

let prod = {
    "REACT_APP_API_ENDPOINT": "https://production-api-ln8l36h6vjpy4gfejda2sqttvu522gpl.coblic.com",
    "REACT_APP_API_VERSION": "v1.0",
    "REACT_APP_PUBNUB_SUBSCRIBE_KEY": "sub-c-1c6e4688-c2db-11e8-a415-1a3a09e2960b",
    "REACT_APP_RECAPTCHA_SITE_KEY": "6Lcb0nYUAAAAABMKrf5nwQh59UO5yOml4Qyh6Pec",
    "REACT_APP_ASSET_ORIGIN": "https://d39eeu3pq7rt6z.cloudfront.net",
}

let prodSt = {
    "REACT_APP_API_ENDPOINT": "https://staging-api-vgeynb6vsktxpsc88j3qmmhjpwvncjge.coblic.com",
    "REACT_APP_API_VERSION": "v1.0",
    "REACT_APP_PUBNUB_SUBSCRIBE_KEY": "sub-c-17e69c14-c2db-11e8-ab1e-765c49db24ca",
    "REACT_APP_RECAPTCHA_SITE_KEY": "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI",
    "REACT_APP_ASSET_ORIGIN": ""
}