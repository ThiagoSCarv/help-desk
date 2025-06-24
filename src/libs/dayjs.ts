import dayjs from 'dayjs'
import isLeapYear from 'dayjs/plugin/isLeapYear'
import 'dayjs/locale/pt-br'

dayjs.extend(isLeapYear) // use plugin

dayjs.locale('pt-br')

export { dayjs }
