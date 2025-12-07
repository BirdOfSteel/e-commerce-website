import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

export default function ProductFilterDropdown({ sortingMethod, setSortingMethod }) {
  const sortingMethods = [
    "Featured",
    "Low to High",
    "High to Low"
  ];

  return (
    <div className="self-start z-[1]">
      <p className="font-bold text-[1.1rem]">Filter:</p>
      <Menu as="div" className="relative w-[120px] text-[white] text-center mb-[1.25rem] self-start">
        <MenuButton className='bg-[rgb(22,96,255)] h-[40px] rounded-md font-bold border-[rgb(0,0,0,0.3)] border-[1px] bg-[rgb(210,210,210)] w-[100%]'>
          { sortingMethod }
        </MenuButton>
        <MenuItems modal={false} className='top-0 absolute w-[100%] left-0'>
          {sortingMethods.map((method, i) => {
            // for conditional border styling
            const isFirstInArray = i === 0; 
            const isLastInArray = i === sortingMethods.length - 1;

            return (
              <MenuItem key={i}>
                <button onClick={() => setSortingMethod(method)}
                  className={`
                    ${isFirstInArray && 'rounded-t-md bg-red'} 
                    ${isLastInArray && 'rounded-b-md rounded-t-none'} 
                    data-[focus]:bg-[rgb(255,153,0)] bg-[rgb(22,96,255)] h-[40px] bg-[rgb(22,96,255)] font-bold block w-full border-[1px] border-[rgb(0,0,0,0.3)]`}
                >
                  {method}
                </button>
              </MenuItem>
            )
          })}
        </MenuItems>
      </Menu>
    </div>
  )
}