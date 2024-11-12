import { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { filterOptions } from '../constants';

const apiUrl = '/api/file';
export default function Home() {
  const [filterSelected, setFilterSelected] = useState(null);
  const [fileData, setFileData] = useState([]);

  const handleSelectFilter = (val) => {
    setFilterSelected(val);
  };

  const getFileData = async () => {
    try {
      const res = await axios.get(apiUrl);
      const fileD = res?.data?.data;
      if (fileD?.length) {
        const formatData = [];
        for (const d of fileD) {
          const split = d.split(';');
          formatData.push({
            createdAt: split[0],
            fileName: split[1],
          });
        }
        setFileData(formatData);
      }
    } catch (error) {
      console.log('error in getting data', error);
    }
  };

  const sortByFunc = (arr, sortBy) => {
    const parseFilename = (filename) => {
      return filename
        .toLowerCase()
        .replace(/(\d+)/g, (match) => match.padStart(10, '0'));
    };
    if (sortBy === 'created_at') {
      return arr.sort((a, b) => {
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
    }
    if (sortBy === 'ascendent_filename') {
      return arr.sort((a, b) => {
        const filenameA = parseFilename(a.fileName);
        const filenameB = parseFilename(b.fileName);
        return filenameA.localeCompare(filenameB);
      });
    } else if (sortBy === 'descendent_filename') {
      return arr
        .sort((a, b) => {
          const filenameA = parseFilename(a.fileName);
          const filenameB = parseFilename(b.fileName);
          return filenameA.localeCompare(filenameB);
        })
        .reverse();
    }
  };

  useEffect(() => {
    if (filterSelected) {
      let sortedData = [];
      if (filterSelected.value === 'created_at') {
        sortedData = sortByFunc([...fileData], filterSelected.value);
      }
      if (filterSelected.value === 'ascendent_filename') {
        sortedData = sortByFunc([...fileData], filterSelected.value);
      }
      if (filterSelected.value === 'descendent_filename') {
        sortedData = sortByFunc([...fileData], filterSelected.value);
      }
      setFileData(sortedData);
    }
  }, [filterSelected]);

  useEffect(() => {
    getFileData();
  }, []);
  return (
    <div className='flex items-center justify-center flex-col bg-black w-full h-full p-10 border border-solid border-white rounded'>
      <Menu as='div' className='mx-auto relative inline-block mb-20'>
        <div>
          <MenuButton className='inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50'>
            {filterSelected !== null
              ? `Sort By ${filterSelected.name}`
              : 'Sort By'}
            <ChevronDownIcon
              aria-hidden='true'
              className='-mr-1 h-5 w-5 text-gray-400'
            />
          </MenuButton>
          <MenuItems
            transition
            className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in'
          >
            {filterOptions.map((op, i) => (
              <div
                className='py-1 cursor-pointer'
                key={i}
                onClick={() => handleSelectFilter(op)}
              >
                <MenuItem>
                  <span className='block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900 data-[focus]:outline-none'>
                    {op.name}
                  </span>
                </MenuItem>
              </div>
            ))}
          </MenuItems>
        </div>
      </Menu>
      <div className='grid grid-cols-2 gap-4 px-20'>
        {fileData.map((d, i) => {
          return (
            <div
              className='border border-solid border-white w-60 h-20 rounded p-4'
              key={i}
            >
              <p className='text-white'>{d.createdAt} </p>
              <p className='text-white'>{d.fileName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
