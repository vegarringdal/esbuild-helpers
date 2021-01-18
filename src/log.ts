/**
 * Simple log helper
 */
export function log(name: any, msg?: any) {
  let d = new Date();
  let H = d.getHours().toString();
  H = H.length > 1 ? H : "0" + H;
  let M = d.getMinutes().toString();
  M = M.length > 1 ? M : "0" + M;
  let S = d.getSeconds().toString();
  S = S.length > 1 ? S : "0" + S;

  console.log(
    "\u001b[34m",
    name,
    "\t\u001b[36;1m",
    `${H}:${M}:${S}`,
    "\u001b[33;1m",
    "\t->",
    msg,
    "\u001b[0m"
  );
}
