def OnEndAllLoadModules(answer):
   import HistoryHelper
   HistoryHelper.DBCarousel()

   return True


def OnCleanup(answer):
   return True


def OnCheckModules(answer):
   return True