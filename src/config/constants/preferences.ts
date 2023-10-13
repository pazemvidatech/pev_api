import dayjs from 'dayjs'

const MININUM_BIRTHDATE_SELLER = dayjs().subtract(18, 'year').toDate()

export default {
  min_birth_package: MININUM_BIRTHDATE_SELLER,
}
