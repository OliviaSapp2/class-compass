const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {

    // Get Stack AI credentials
    const apiKey = Deno.env.get('STACKAI_API_KEY')
    const baseUrl = Deno.env.get('STACKAI_BASE_URL')
    const flowId = Deno.env.get('STACKAI_ANALYZE_FLOW_ID')

    if (!apiKey || !baseUrl || !flowId) {
      console.error('Missing Stack AI configuration')
      return new Response(
        JSON.stringify({ ok: false, error: 'Stack AI not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Parse request body
    const { prompt, class_id, student_ids, upload_refs, user_id } = await req.json()

    console.log('Analyze request:', { user_id, class_id, student_ids: student_ids?.length, upload_refs: upload_refs?.length })

    // Map to Stack AI input format
    const stackPayload = {
      'in-0': JSON.stringify({
        prompt: prompt || 'Analyze student performance',
        user_id,
        class_id,
        student_ids,
        upload_refs,
      }),
    }

    // Call Stack AI
    const stackUrl = `${baseUrl}/${flowId}`
    console.log('Calling Stack AI:', stackUrl)

    const stackResponse = await fetch(stackUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stackPayload),
    })

    if (!stackResponse.ok) {
      const errorText = await stackResponse.text()
      console.error('Stack AI error:', stackResponse.status, errorText)
      return new Response(
        JSON.stringify({ ok: false, error: `Stack AI error: ${stackResponse.status}` }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const contentType = stackResponse.headers.get('content-type')
    if (!contentType?.includes('application/json')) {
      const text = await stackResponse.text()
      console.error('Stack AI returned non-JSON:', text.slice(0, 200))
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid response from Stack AI' }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const stackData = await stackResponse.json()
    console.log('Stack AI response received')

    return new Response(
      JSON.stringify({ ok: true, data: stackData }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error in agent-analyze:', error)
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
