import trimStr from '../utils/utils.js'

let users = []

export const findUser = ({ name, room }) => {
    const userName = trimStr(name)
    const userRoom = trimStr(room)

    return users.find(
      (data) => trimStr(data.name) === userName && trimStr(data.room) === userRoom
    )
}

const addUser = ({ name, room }) => {
    const isExist = findUser({ name, room })

    !isExist && users.push({ name, room })

    const currentUser = isExist || { name, room }

    return { isExist: !!isExist, user: currentUser }
}

export default addUser
