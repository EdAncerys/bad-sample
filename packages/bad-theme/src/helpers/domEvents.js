export const copyToClipboard = (e) => {
  let link = e.target.innerText;
  // if coppiced link value is undefined
  if (!link) link = e.target.name;
  console.log("link value", link); //debug

  var input = document.body.appendChild(document.createElement("input"));
  input.value = link;
  input.focus();
  input.select();
  document.execCommand("copy");
  input.parentNode.removeChild(input);
};
