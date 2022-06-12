// document.body.style.backgroundColor = "orange";
console.log("my name is viet, hello world");
function domain_from_url(url) {
  var subdomain;
  var match;
  if (
    (match = url.match(
      /^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n\?\=]+)/im
    ))
  ) {
    subdomain = match[1];
    // if ((match = subdomain.match(/^[^\.]+\.(.+\..+)$/))) {
    //   subdomain = match[1];
    // }
  }
  // /(?:http[s]*\:\/\/)*(.*?)\.(?=[^\/]*\..{2,5})/i
  var subdomain;
  //   if (subdomain){
  //     // geting the domain
  // result = subdomain + "." + "abc"
  //   }
  return subdomain;
}
let d1 =
  "https://play.google.com/store/apps/details?id=com.skgames.trafficracer%22";
// play.google.com
console.log(domain_from_url(d1));
let d2 = "http://mplay.google.co.in/sadfask/asdkfals?dk=10";
// mplay.google.co.in
console.log(domain_from_url(d2));

let d3 = "http://lplay.google.co.in/sadfask/asdkfals?dk=10";
console.log(domain_from_url(d3));

let d4 = "http://play.google.co.in/sadfask/asdkfals?dk=10";
// play.google.co.in
console.log(domain_from_url(d4));

let d5 = "http://tplay.google.co.in/sadfask/asdkfals?dk=10";
// tplay.google.co.in
console.log(domain_from_url(d5));

let d6 = "http://www.google.co.in/sadfask/asdkfals?dk=10";
// google.co.in
console.log(domain_from_url(d6));

let d7 = "www.google.co.in/sadfask/asdkfals?dk=10";
// google.co.in
console.log(domain_from_url(d7));

let d8 = "http://user:pass@google.com/?a=b#asdd";
// google.com
console.log(domain_from_url(d8));

let d9 = "https://www.compzets.com?sd=10";
// compzets.com
console.log(domain_from_url(d9));
// compzets.com

const regex = new RegExp(
  "^(http://|https://|http://www\\.|https://www\\.|www\\.)?(www\\.(twanda))?(([\\w\\-]+)?\\.?(twanda|))(\\.ch|\\.com)(:\\d+)?/.+$",
  "igm"
);
const str = `www.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
www.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
http://twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
https://twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
http://www.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
http://www.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
https://www.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
https://www.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
http://flohmarkt-zug.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
http://flohmarkt-zug.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
https://flohmarkt-zug.twanda.ch/store/apps/details?id=com.skgames.trafficracer%22
https://flohmarkt-zug.twanda.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
www.flohmarkt-zug.ch/store/apps/details?id=com.skgames.trafficracer%22
www.flohmarkt-zug.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.ch/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
http://www.flohmarkt-zug.ch/store/apps/details?id=com.skgames.trafficracer%22
http://www.flohmarkt-zug.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
https://www.flohmarkt-zug.ch/store/apps/details?id=com.skgames.trafficracer%22
https://www.flohmarkt-zug.ch:8069/store/apps/details?id=com.skgames.trafficracer%22
www.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
www.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
twanda.com/store/apps/details?id=com.skgames.trafficracer%22
twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
http://www.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
http://www.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
https://www.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
https://www.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
http://flohmarkt-zug.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
http://flohmarkt-zug.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
https://flohmarkt-zug.twanda.com/store/apps/details?id=com.skgames.trafficracer%22
https://flohmarkt-zug.twanda.com:8069/store/apps/details?id=com.skgames.trafficracer%22
www.flohmarkt-zug.com/store/apps/details?id=com.skgames.trafficracer%22
www.flohmarkt-zug.com:8069/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.com/store/apps/details?id=com.skgames.trafficracer%22
flohmarkt-zug.com:8069/store/apps/details?id=com.skgames.trafficracer%22
http://www.flohmarkt-zug.com/store/apps/details?id=com.skgames.trafficracer%22
http://www.flohmarkt-zug.com:8069/store/apps/details?id=com.skgames.trafficracer%22
https://www.flohmarkt-zug.com/store/apps/details?id=com.skgames.trafficracer%22
https://www.flohmarkt-zug.com:8069/store/apps/details?id=com.skgames.trafficracer%22
`;
const subst = ``;

// The substituted value will be contained in the result variable
const result = str.replace(regex, subst);

console.log("Substitution result: ", result);
