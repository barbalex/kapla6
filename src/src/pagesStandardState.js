import pageStandardState from './pageStandardState'

const pagesStandardState = {
  pages: [{ ...pageStandardState }],
  activePageIndex: 0,
  remainingGeschaefte: [],
  building: false,
  title: '',
  queryTitle: true,
  reportType: 'fristen',
}

export default pagesStandardState
