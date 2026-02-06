import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

// Topics that middle school students struggle with most
const CHALLENGING_TOPICS = [
  { subject: 'Math', topics: ['Fractions', 'Algebra basics', 'Negative numbers', 'Ratios and proportions', 'Geometry proofs'] },
  { subject: 'Science', topics: ['Cell biology', 'Chemical equations', 'Physics forces', 'Scientific method'] },
  { subject: 'English', topics: ['Reading comprehension', 'Essay writing', 'Grammar rules', 'Literary analysis'] },
  { subject: 'History', topics: ['Historical cause and effect', 'Primary sources', 'Timeline analysis'] },
]

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('APIFY_API_KEY')
    if (!apiKey) {
      console.error('APIFY_API_KEY not configured')
      return new Response(
        JSON.stringify({ success: false, error: 'Apify API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { action, subject, topic, searchQuery } = await req.json()

    console.log('Received request:', { action, subject, topic, searchQuery })

    if (action === 'scrape') {
      // Use Apify's web scraper actor to scrape educational content
      const query = searchQuery || `${topic} ${subject} middle school explanation tutorial`
      
      console.log('Starting Apify scrape for:', query)

      // Use Apify's Google Search Results Scraper
      const actorRunResponse = await fetch(
        `https://api.apify.com/v2/acts/apify~google-search-scraper/runs?token=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            queries: query,
            maxPagesPerQuery: 1,
            resultsPerPage: 5,
            languageCode: 'en',
            mobileResults: false,
          }),
        }
      )

      if (!actorRunResponse.ok) {
        const errorText = await actorRunResponse.text()
        console.error('Apify actor run failed:', errorText)
        return new Response(
          JSON.stringify({ success: false, error: 'Failed to start Apify actor' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      const runData = await actorRunResponse.json()
      const runId = runData.data.id

      console.log('Apify run started:', runId)

      // Wait for the run to complete (poll every 2 seconds, max 30 seconds)
      let status = 'RUNNING'
      let attempts = 0
      const maxAttempts = 15

      while (status === 'RUNNING' && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        
        const statusResponse = await fetch(
          `https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`
        )
        const statusData = await statusResponse.json()
        status = statusData.data.status
        attempts++
        console.log(`Poll attempt ${attempts}: status = ${status}`)
      }

      if (status !== 'SUCCEEDED') {
        console.error('Apify run did not succeed:', status)
        return new Response(
          JSON.stringify({ success: false, error: `Apify run status: ${status}` }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get the results
      const datasetResponse = await fetch(
        `https://api.apify.com/v2/actor-runs/${runId}/dataset/items?token=${apiKey}`
      )
      const results = await datasetResponse.json()

      console.log('Apify results:', JSON.stringify(results).slice(0, 500))

      // Parse and store results
      const resources = []
      for (const result of results) {
        if (result.organicResults) {
          for (const item of result.organicResults.slice(0, 5)) {
            const resource = {
              topic: topic || 'General',
              subject: subject || 'General',
              grade_level: 'middle_school',
              title: item.title || 'Untitled',
              content: item.description || item.snippet || '',
              source_url: item.url || item.link || '',
              difficulty: 'medium',
              resource_type: 'article',
            }

            // Insert into database
            const { data, error } = await supabase
              .from('educational_resources')
              .insert(resource)
              .select()

            if (error) {
              console.error('Error inserting resource:', error)
            } else {
              resources.push(data[0])
            }
          }
        }
      }

      console.log(`Stored ${resources.length} resources`)

      return new Response(
        JSON.stringify({ success: true, data: resources, count: resources.length }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'get-topics') {
      return new Response(
        JSON.stringify({ success: true, data: CHALLENGING_TOPICS }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (action === 'list') {
      // Fetch existing resources from database
      let query = supabase.from('educational_resources').select('*')
      
      if (subject) {
        query = query.eq('subject', subject)
      }
      if (topic) {
        query = query.ilike('topic', `%${topic}%`)
      }

      const { data, error } = await query.order('scraped_at', { ascending: false }).limit(50)

      if (error) {
        console.error('Error fetching resources:', error)
        return new Response(
          JSON.stringify({ success: false, error: error.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ success: true, data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ success: false, error: 'Invalid action' }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in edge function:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
