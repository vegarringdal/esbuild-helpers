let id = 0;
const events: any = {};

export function newId() {
  id++;
  return id;
}

export function subscribe(name: string, ctx: any) {
  if (events[name]) {
    events[name].push(ctx);
  } else {
    events[name] = [];
    events[name].push(ctx);
  }
}

export function publish(name: string) {
  if (events[name]) {
    events[name].forEach((y: any) => {
      y();
    });
  }
}
