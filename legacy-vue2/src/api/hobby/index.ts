import { request } from "@/utils"
import { IArticleItem, IBlogCategory } from "blog"
const imgs = {
  hanataba: require("@/assets/hanataba.jpeg"),
  honmura: require("@/assets/honmura.jpg"),
  niina: require("@/assets/niina.png"),
  platicmenories: require("@/assets/platicmenories.jpg"),
  whiteAlbum2: require("@/assets/whiteAlbum2.jpg"),
  kirikitu: require("@/assets/danmachi4.jpg"),
  door: require("@/assets/door.jpg"),
  Gintama: require("@/assets/Gintama.jpg"),
  godknows: require("@/assets/godknows.jpg"),
}

export const getHobbyList = ({ id = -1 }) => {
  return request<{ rows: Partial<IArticleItem> & { audio: string }; total: number }>({ url: "hobby" }).catch(() => {
    const res = [
      {
        thumb: imgs.whiteAlbum2,
        title: "届かない恋",
        createDate: "2018-01-14",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/totokanaikoi.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "初めての日本語歌",
        id: 1,
      },
      {
        thumb: imgs.Gintama,
        title: "ヒカリ証明論",
        createDate: "2019-10-10",
        scanNumber: 0,
        commentNumber: 0,
        category: {
          id: "1",
          name: "Song",
        },
        audio: require("@/assets/ヒカリ証明論.m4a"),
        description: "二回目の日本語歌",
        id: 2,
      },
      {
        thumb: imgs.honmura,
        title: "炎",
        createDate: "2020-08-06",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/炎.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "三回目の日本語歌",
        id: 3,
      },
      {
        thumb: imgs.door,
        title: "Door",
        createDate: "2021-08-22",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/Door.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "四回目の日本語歌",
        id: 4,
      },
      {
        thumb: imgs.hanataba,
        title: "愛をこめて花束を",
        createDate: "2022-08-20",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/爱をこめて花束を.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "五回目の日本語歌",
        id: 5,
      },
      {
        thumb: imgs.kirikitu,
        title: "切り傷",
        createDate: "2023-03-25",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/切り傷.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "六回目の日本語歌",
        id: 6,
      },
      {
        thumb: imgs.godknows,
        title: "god knows",
        createDate: "2024-08-31",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/Godknows.m4a"),
        category: {
          id: "1",
          name: "Song",
        },
        description: "七回目の日本語歌",
        id: 7,
      },
      {
        thumb: imgs.platicmenories,
        title: "plastic menories",
        createDate: "2023-06-06",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/plasticmemories.m4a"),
        category: {
          id: "2",
          name: "Read",
        },
        description: "初めての日本語朗読",
        id: 8,
      },
      {
        thumb: imgs.niina,
        title: "ダンまち19卷--ニーナ",
        createDate: "2024-01-20",
        scanNumber: 0,
        commentNumber: 0,
        audio: require("@/assets/danmati19.m4a"),
        category: {
          id: "2",
          name: "Read",
        },
        description: "二回目の日本語歌",
        id: 9,
      },
    ]

    return {
      code: "",
      data: {
        rows: res.filter((x) => id === -1 || id === +x.category.id) as any,
        total: res.length,
      },
    }
  })
}

export const getHobbyMenu = () => {
  return request<{ rows: IBlogCategory[]; total: number }>({
    url: "hobby/hobbyType",
  }).catch(() => {
    const res: IBlogCategory[] = [
      {
        id: "1",
        name: "Song",
        articleCount: "7",
        order: "1",
      },
      {
        id: "2",
        name: "Read",
        articleCount: "2",
        order: "2",
      },
    ]
    return {
      code: "",
      data: {
        rows: res,
        total: res.length,
      },
    }
  })
}
