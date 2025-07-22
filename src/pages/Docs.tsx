"use client"

import { useState, useRef, type Dispatch, type SetStateAction } from "react"
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion"
import { Search, ChevronRight, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { navigation } from "@/lib/docs-data"
import type { NavGroup } from "@/lib/docs-data"

// --- Sub-component 1: Content Item with Parallax ---
type DocsContentItemProps = {
  id: string
  tagline: string
  title: string
  description: string[]
  imageQuery: string
  index: number
}

const DocsContentItem = ({ id, tagline, title, description, imageQuery, index }: DocsContentItemProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const isEven = index % 2 === 0

  return (
    <div id={id} ref={ref} className="relative scroll-mt-28">
      <div className={`lg:grid lg:grid-cols-2 lg:gap-12 xl:gap-20 items-center`}>
        <div
          className={`relative h-80 md:h-[450px] rounded-3xl overflow-hidden shadow-xl ${isEven ? "lg:order-2" : ""}`}
        >
          <motion.div className="absolute inset-0" style={{ y }}>
            <img
              src={`/placeholder.svg?height=600&width=800&query=${encodeURIComponent(imageQuery)}`}
              alt={title}
              width={800}
              height={600}
              className="bg-gray-100 w-full h-full object-cover"
            />
          </motion.div>
        </div>
        <div className={`mt-8 lg:mt-0 ${isEven ? "lg:order-1" : ""}`}>
          <div className="flex items-start mb-6">
            <h3 className="text-2xl md:text-3xl font-black mr-auto uppercase tracking-tight">{title}</h3>
            <span className="ml-4 mt-1 flex-shrink-0 w-12 h-12 flex items-center justify-center text-lg font-bold bg-black text-white rounded-full">
              {tagline}
            </span>
          </div>
          <div className="space-y-5 text-base text-gray-700 font-medium leading-relaxed">
            {description.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// --- Sub-component 2: Sidebar ---
type DocsSidebarProps = {
  navigation: NavGroup[]
  openGroupId: string | null
  setOpenGroupId: Dispatch<SetStateAction<string | null>>
}

const DocsSidebar = ({ navigation, openGroupId, setOpenGroupId }: DocsSidebarProps) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const handleGroupClick = (groupId: string) => {
    setOpenGroupId((prevId) => (prevId === groupId ? null : groupId))
  }

  const handleLinkClick = (anchor: string) => {
    setIsMobileNavOpen(false)
    const element = document.getElementById(anchor)
    if (element) {
      // The `scroll-mt-28` class on the target element provides the offset
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  const renderNav = () => (
    <div className="lg:sticky lg:top-28">
      {navigation.map((group) => (
        <div className="mb-4" key={group.id}>
          <button
            className="flex items-center w-full text-left py-2.5 group"
            onClick={() => handleGroupClick(group.id)}
          >
            <div className="w-8 h-8 flex items-center justify-center">
              <ChevronRight
                className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${
                  group.id === openGroupId ? "rotate-90" : ""
                }`}
              />
            </div>
            <h3 className="text-lg font-bold text-black uppercase tracking-tight group-hover:text-gray-700">
              {group.title}
            </h3>
          </button>
          <AnimatePresence>
            {group.id === openGroupId && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <ul className="pl-8 py-2 border-l border-gray-200 ml-4">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <a
                        className="block py-2 pl-4 text-base text-gray-600 hover:text-black border-l-2 border-transparent hover:border-black transition-all font-medium cursor-pointer"
                        onClick={(e) => {
                          e.preventDefault()
                          handleLinkClick(`anchor-${group.id}-${item.id}`)
                        }}
                        href={`#anchor-${group.id}-${item.id}`}
                      >
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )

  return (
    <aside className="mb-12 lg:mb-0">
      <div className="lg:hidden">
        <button
          onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
          className="flex items-center justify-between w-full h-16 px-6 bg-gray-50 border border-gray-200 rounded-xl"
        >
          <span className="text-lg font-bold text-gray-800 uppercase tracking-tight">Menu</span>
          <ChevronDown
            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isMobileNavOpen ? "rotate-180" : ""}`}
          />
        </button>
        <AnimatePresence>
          {isMobileNavOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden mt-2 bg-white rounded-xl border border-gray-200 shadow-lg"
            >
              <div className="p-4">{renderNav()}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="hidden lg:block">{renderNav()}</div>
    </aside>
  )
}

// --- Main Page Component ---
export default function DocsPage() {
  const [openGroupId, setOpenGroupId] = useState<string | null>(navigation[0]?.id || null)

  return (
    <div className="bg-white text-black min-h-screen font-sans">
      <section className="relative py-24 md:py-32 px-6 bg-white overflow-hidden border-b border-gray-200">
        <div className="absolute inset-0 bg-[url(/grid.png)] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight">Documentation</h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get started with FuteurCred - Business credit platform and experience the power of AI in your credit
            journey!
          </p>
        </div>
      </section>

      <main className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="relative max-w-3xl mb-12 md:mb-20 mx-auto">
          <Search className="absolute top-1/2 left-6 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full h-16 pl-14 pr-6 bg-white border border-gray-200 rounded-full outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200 placeholder-gray-500 shadow-sm text-lg"
            type="text"
            placeholder="Search topics..."
          />
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-12 xl:gap-20">
          <DocsSidebar navigation={navigation} openGroupId={openGroupId} setOpenGroupId={setOpenGroupId} />

          <div className="lg:mt-0">
            {navigation.map((group) => (
              <div key={group.id} className="mb-20">
                <h2 className="text-3xl font-black mb-12 md:mb-16 pb-6 border-b border-gray-200 uppercase tracking-tight">
                  {group.title}
                </h2>
                <div className="space-y-24 md:space-y-32">
                  {group.items.map((item, index) => (
                    <DocsContentItem
                      key={item.id}
                      id={`anchor-${group.id}-${item.id}`}
                      tagline={item.tagline}
                      title={item.title}
                      description={item.description}
                      imageQuery={item.imageQuery}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            ))}

          </div>
        </div>
      </main>
    </div>
  )
}

