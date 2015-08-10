## Deploys the main app Javascript bundle for the UQDraw app to

DeployURL="artifex.zones.eait.uq.edu.au"
DeployDirectory="/home/uqdraw/www"

# Copy the bundle to moss (the halfway point)
scp build/bundle.js moss:.

# Move to moss and complete the deployment
ssh -At moss scp bundle.js $DeployURL:$DeployDirectory
