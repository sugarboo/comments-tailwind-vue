export const transformPageObject = (id, properties) => {
  return {
    id,
    user: properties?.user.rich_text[0]?.text?.content,
    time: getRelativeTimeDesc(properties?.time?.created_time),
    content: properties?.content?.rich_text[0]?.text?.content,
    avatar: properties?.avatar?.url,
    replies: properties?.replies?.relation,
    replyTo: properties?.replyTo?.relation[0]?.id
  }
}

const getRelativeTimeDesc = (time) => {
  const currentInMs = new Date().getTime()
  const timeInMs = new Date(time).getTime()

  const minuteInMs = 60 * 1000
  const hourInMs = 60 * minuteInMs
  const dayInMs = 24 * hourInMs
  const monthInMs = 30 * dayInMs
  const yearInMs = 12 * monthInMs

  const relativeTime = currentInMs - timeInMs
  if (relativeTime < minuteInMs) {
    return `${Math.ceil(relativeTime / 1000)} seconds ago`
  } else if (relativeTime < hourInMs) {
    return `${Math.ceil(relativeTime / hourInMs)} minutes ago`
  } else if (relativeTime < dayInMs) {
    return `${Math.ceil(relativeTime / dayInMs)} days ago`
  } else if (relativeTime < monthInMs) {
    return `${Math.ceil(relativeTime / monthInMs)} months ago`
  } else if (relativeTime < yearInMs) {
    return `${Math.ceil(relativeTime / yearInMs)} years ago`
  } else {
    return ''
  }
}