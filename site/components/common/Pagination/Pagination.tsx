import Link from 'next/link'

type Props = {
  currentPage: number
  numPages: number
  basePath: string
}

const Pagination: React.FC<Props> = ({ currentPage, numPages, basePath }) => {
  const prevPage = currentPage - 1
  const nextPage = currentPage + 1
  const hasPrevPage = prevPage > 0
  const hasNextPage = nextPage <= numPages

  return (
    <nav className="flex justify-between my-8">
      <div>
        {hasPrevPage && (
          // <Link href={`${basePath}/page/${prevPage}`}>
          <p className="text-gray-900 dark:text-white hover:text-gray-700">
            ← Previous
          </p>
        )}
      </div>
      <div className="text-gray-700 dark:text-white">
        {currentPage} of {numPages}
      </div>
      <div>
        {hasNextPage && (
          // <Link href={`${basePath}/page/${nextPage}`}>
          <p className="text-gray-900 dark:text-white hover:text-gray-700">
            Next →
          </p>
          // </Link>
        )}
      </div>
    </nav>
  )
}

export default Pagination
