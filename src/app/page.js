'use client'
import Image from 'next/image'
import logo from '@assets/logo.svg'
import {useRouter} from 'next/navigation'
import routes from '@routes'
import React, {useEffect, useState} from 'react'
import {TiArrowSortedUp} from 'react-icons/ti'
import axios from 'axios'

export default function Home() {
  const router = useRouter()

  const [load, setLoad] = useState(true)
  const [stories, setStories] = useState()

  useEffect(() => {
    fetchData()
  }, [])

  const loopData = async (newData) => {
    try {
      let result = []
      for (let i = 0; i < 30; i++) {
        const getData = await axios({
          method: 'GET',
          url: `https://hacker-news.firebaseio.com/v0/item/${newData[i]}.json`
        })
        result.push(getData.data)
      }
      setStories(result)
    } catch (error) {
      console.log('error loop', error)
    }
  }

  const fetchData = async () => {
    try {
      const {data} = await axios({
        method: 'GET',
        url: `https://hacker-news.firebaseio.com/v0/topstories.json`
      })
      await loopData(data)
      setLoad(false)
    } catch (error) {
      console.log('error on Fetch', error)
    }
  }

  const checkLink = (urlText) => {
    if (urlText === undefined) {
      return 'no link'
    }
    const url = new URL(urlText)
    const dots = []
    const newURL = url.hostname
    for (let i = 0; i < newURL.length; i++) {
      if (dots.length < 2) {
        if (newURL[i] === '.') {
          dots.push([i + 1])
        }
      }
    }

    if (newURL.indexOf('wordpress') > -1) {
      return newURL
    } else if (dots.length > 1) {
      return newURL.slice(dots[0], newURL.length)
    } else {
      return newURL
    }
  }
  const countComments = (comments) => {
    return comments?.length
  }

  if (load) {
    return (
      <div className='flex min-h-screen items-center justify-center flex-col'>
        <div role='status'>
          <svg
            aria-hidden='true'
            className='inline w-8 h-8 mr-2 text-gray-200 animate-spin fill-blue-200'
            viewBox='0 0 100 101'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
              fill='#ff6600'
            />
            <path
              d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
              fill='#ffff'
            />
          </svg>
        </div>
        <div className='mt-2'>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <main className='min-h-screen bg-realWhite lg:py-2 lg:px-28 font-sans'>
      <div className='bg-hacker-orange text-sm flex justify-between lg:p-0.5'>
        <div className='flex'>
          <div className='flex items-center'>
            <div className='border-solid border border-realWhite lg:mr-1'>
              <Image src={logo} width={17} height={17} alt='Picture of the author' />
            </div>
            <p className='font-bold'>Hacker News</p>
          </div>
          {routes.map((item) => (
            <div key={item.id} className='flex cursor-pointer' onClick={() => router.push(item.route)}>
              <p className='mx-1.5'>{item.name}</p>
              {item.id !== routes.length ? <p>|</p> : ''}
            </div>
          ))}
        </div>
        <div className='mr-2'>
          <p>login</p>
        </div>
      </div>
      <div className='bg-hacker-gray '>
        <div className='text-sm py-1 px-2'>
          {!load &&
            stories &&
            stories.map((item, index) => (
              <div key={index} className='py-0.5 flex '>
                <p className='text-hacker-text'>{index + 1}.</p>
                <div className=''>
                  <TiArrowSortedUp size='20' color='gray' />
                </div>
                <div>
                  <div className='flex items-end'>
                    <p className='text-sm'>{item.title}</p>
                    <div className='mx-1'>
                      <a href={item.url} target='_blank' rel='noopener noreferrer'>
                        <p className='text-xs text-hacker-text'>({checkLink(item.url)})</p>
                      </a>
                    </div>
                  </div>
                  <p className='text-xs text-hacker-text'>
                    {item.score} points by {item.by} | hide | {countComments(item.kids)} comments
                  </p>
                </div>
              </div>
            ))}
          <div className='ml-10 mt-2 '>
            <p className='text-sm text-hacker-text cursor-pointer'>More</p>
          </div>
        </div>
        <hr className='border-hacker-orange border-1 h-1 py-1' />
        <p className='text-xs text-center'>Guidelines | FAQ | Lists | API | Security | Legal | Apply to YC | Contact</p>
      </div>
    </main>
  )
}
