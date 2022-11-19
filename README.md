# Carpool

npm install --global yarn

yarn --version

yarn create vuetify

console.log("token expiry date type", tokenExpiryDate);
console.log("token expiry date ISOString ", new Date(tokenExpiryDate.toISOString()));
console.log("token expiry date ISOString ", tokenExpiryDate.toISOString());
console.log("token expiry date type === ISOString date type converted to date", tokenExpiryDate.getTime() > new Date(tokenExpiryDate.toISOString()).getTime());
console.log("token expiry date type === ISOString date type converted to date", tokenExpiryDate.getTime() < new Date(tokenExpiryDate.toISOString()).getTime());
console.log("token expiry date type === ISOString date type converted to date", tokenExpiryDate.getTime() == new Date(tokenExpiryDate.toISOString()).getTime());
console.log("token expiry date type === ISOString date type converted to date", typeof tokenExpiryDate , typeof new Date(tokenExpiryDate.toISOString()));