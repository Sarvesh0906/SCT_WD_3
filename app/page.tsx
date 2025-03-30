import DropdownOptions from '@/components/DropdownOptions'
import InputBox from '@/components/InputBox'
import Button from '@/components/Buttons'

export default function Home() {

  return (
    <section className='flex flex-col justify-center items-center'>
      {/* //from flowbite */}
      <h1 className="mb-8 mt-20 text-4xl font-extrabold leading-none tracking-tight text-white md:text-5xl lg:text-6xl dark:text-white">myQuizz - A Quiz Game App</h1>

      <section className='p-10 my-10 rounded-lg bg-white shadow-xl w-[65%]'>
        {/* Flowbite? */}
        <InputBox />

        <DropdownOptions />

        <div className=" flex items-center justify-center">
          <Button />
        </div>

      </section>
    </section>
  )
}
