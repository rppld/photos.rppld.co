import * as React from 'react'
import { NextPage, GetStaticProps } from 'next'
import Link from 'next/link'
import { Homepage, Post } from '../types'
import { getResource } from '../utils/storyblok'
import Layout from '../components/Layout'
import Banner from '../components/Banner'
import ProjectThumb from '../components/ProjectThumb'
import createMarkup from '../utils/create-markup'
import Grid, { GridItem } from '../components/Grid'
import getGridItemSize from '../utils/get-grid-item-size'

interface Props {
  story: Homepage
  portfolio: [Post]
}

const IndexPage: NextPage<Props> = props => {
  let count = 0

  return (
    <Layout>
      <Banner>
        <h1
          dangerouslySetInnerHTML={createMarkup(props.story.content.intro, {
            renderInline: true,
          })}
        />
      </Banner>

      <Grid>
        {props.portfolio.map(({ id, slug, name, content }) => {
          count < 6 ? count++ : (count = 1)

          return (
            <GridItem key={id} size={getGridItemSize(count)}>
              <Link href="/[slug]" as={`/${slug}`}>
                <a className="default">
                  <ProjectThumb name={name} content={content} />
                </a>
              </Link>
            </GridItem>
          )
        })}
      </Grid>

      <style jsx>{`
        a {
          display: block;
          width: 100%;
        }
      `}</style>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { story } = await getResource({
    slug: 'home',
    resolveRelations: 'portfolio',
  })

  const { stories } = await getResource({
    withTag: 'portfolio',
  })

  return {
    props: {
      story,
      portfolio: stories,
    },
  }
}

export default IndexPage
