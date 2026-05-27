import { IconChevronDown } from './icons.jsx'

// button.M9hao_P.ANr9eYH.s6sKz3z:
//   bg primary, border-sm control-stroke-light (gray-4), radius-lg
//   min-w 168, max-w 264, w 264, min-height 36, padding-right 28, padding-left ~xs
//   .oz3PvYE — align-items center
//     span "All apps" (text-md font-bold text-primary)
//     span.W8UoLnz.sSPRcuv.urJtGiA "1" (h-20, px-4, margin-left auto, radius-md fit-content)
export default function AppSelector() {
  return (
    <button
      className="relative flex w-[264px] min-w-[168px] max-w-[264px] cursor-pointer items-center rounded-af-lg border border-af-gray-5 bg-af-bg-primary py-af-xxs pl-af-xs pr-[28px] text-left text-af-md text-af-text-primary transition-colors hover:border-af-blue-5"
    >
      <div className="flex w-full items-center gap-af-xxs">
        <span className="truncate font-af-bold text-af-text-primary">All apps</span>
        <span className="ml-auto inline-flex h-5 items-center rounded-af-md bg-af-bg-secondaryGray px-af-xxxs text-af-sm font-af-bold text-af-text-primary">
          1
        </span>
      </div>
      <IconChevronDown className="absolute right-af-xs top-1/2 -translate-y-1/2 text-af-icon-tertiary" />
    </button>
  )
}
