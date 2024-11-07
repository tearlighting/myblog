export function listToTree<T extends Record<"children", any[]>, R extends T & Record<"parent", any>>(list: T[], parent: R = null): R[] {
  const res: R[] = []
  for (let i of list) {
    const item: R = {
      ...i,
      parent,
    } as R
    if (i.children?.length) {
      item.children = listToTree(i.children, i)
    }
    res.push(item)
  }
  return res
}
