# Netlify provides the final production URL during every build. Using it here keeps
# canonical and Open Graph URLs correct without committing a deployment-specific name.
Jekyll::Hooks.register :site, :after_init do |site|
  netlify_url = ENV.fetch("URL", "").strip
  site.config["url"] = netlify_url unless netlify_url.empty?
end
