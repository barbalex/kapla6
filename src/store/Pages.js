import { types, getParent } from 'mobx-state-tree'

import Page from './Page'
import pageStandardState from '../src/pageStandardState'

export default types
  .model('Pages', {
    pages: types.array(Page),
    activePageIndex: types.optional(types.number, 0),
    building: types.optional(types.boolean, false),
    title: types.optional(types.string, ''),
    queryTitle: types.optional(types.boolean, true),
    reportType: types.optional(types.string, 'fristen'),
    // this is array of idGeschaeft
    remainingGeschaefte: types.array(types.integer),
  })
  .actions((self) => ({
    initiate(reportType) {
      const store = getParent(self, 1)
      self.cleanUp()
      const { geschaefteFilteredAndSorted } = store.geschaefte
      self.reportType = reportType
      self.remainingGeschaefte = geschaefteFilteredAndSorted.map(
        (g) => g.idGeschaeft,
      )
      self.building = true
      store.setLocation(['pages'])
    },
    cleanUp() {
      self.pages = [{ ...pageStandardState }]
      self.activePageIndex = 0
      self.remainingGeschaefte = []
      self.building = false
      self.title = ''
      self.queryTitle = true
      self.reportType = 'fristen'
    },
    stop() {
      self.remainingGeschaefte = []
      self.building = false
    },
    finishedBuilding() {
      self.building = false
    },
    pagesQueryTitle(queryTitle) {
      self.queryTitle = queryTitle
    },
    setTitle(title) {
      self.title = title
    },
    newPage() {
      self.activePageIndex += 1
      self.pages.push({ ...pageStandardState })
    },
    addGeschaeft() {
      if (self.building) {
        const activePage = self.pages.find((p, i) => i === self.activePageIndex)
        if (activePage && self.remainingGeschaefte.length) {
          activePage.geschaefte.push(self.remainingGeschaefte.shift())
        }
      }
    },
    moveGeschaeftToNewPage() {
      // remove geschaeft from active page
      const activePage = self.pages.find((p, i) => i === self.activePageIndex)
      if (activePage) {
        activePage.full = true
        self.remainingGeschaefte.unshift(activePage.geschaefte.pop())
        self.newPage()
        self.addGeschaeft()
      }
    },
  }))
