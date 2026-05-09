# Automated Azure Deployment Plan (GitHub Actions)

This plan uses **GitHub Actions** to build and deploy the UML Architect application. This avoids needing Docker on your local machine and bypasses the `TasksOperationsNotAllowed` restriction in Azure.

---

### **1. Azure Infrastructure (Initial One-Time Setup)**
You must have the Resource Group, ACR, and Container Apps Environment created.

```bash
RG="uml-architect-rg"
LOCATION="eastus"
ACR_NAME="acrumlarchitect12345"

# Create ACR (Enable Admin to get credentials)
az acr create --resource-group $RG --name $ACR_NAME --sku Basic --admin-enabled true

# Create ACA Environment
az containerapp env create --name env-uml-architect --resource-group $RG --location $LOCATION
```

---

### **2. Security & Credentials**
GitHub needs permission to deploy to your Azure account.

**A. Create Service Principal**
```bash
# Copy the output of this command
az ad sp create-for-rbac --name "github-actions-sp" --role contributor \
  --scopes /subscriptions/<YOUR_SUBSCRIPTION_ID>/resourceGroups/$RG \
  --sdk-auth
```

**B. Add GitHub Secrets**
In your GitHub repo, go to **Settings > Secrets and variables > Actions** and add:
- `AZURE_CREDENTIALS`: (The JSON from step A)
- `ACR_NAME`: `acrumlarchitect12345`
- `ACR_USERNAME`: (Find in Azure Portal > ACR > Access Keys)
- `ACR_PASSWORD`: (Find in Azure Portal > ACR > Access Keys)

---

### **3. Automated Deployment Workflow**
I have created the workflow file at `.github/workflows/deploy.yml`. 

**To trigger the deployment:**
1. Commit the `.github/workflows/deploy.yml` file.
2. Push your code to the `master` branch.
3. Go to the **Actions** tab in GitHub to watch the build.

---

### **4. Why this is the "Full Azure" way:**
- **Zero Local Dependencies**: You don't need Docker, Java, or Node installed on your PC.
- **Remote Build**: GitHub Runners build the images, so your local internet bandwidth isn't used for uploading large Docker layers.
- **Continuous Deployment**: Every time you push code, the app updates automatically on Azure.
- **Security**: Uses Azure Service Principals and GitHub Secrets instead of shared passwords.

---

### **5. Post-Deployment**
Once the GitHub action finishes, your apps will be live at:
- **Frontend**: `https://ca-frontend.<hash>.eastus.azurecontainerapps.io`
- **Backend**: `https://ca-backend.<hash>.eastus.azurecontainerapps.io`

*Note: Ensure the `BACKEND_URL` environment variable in the Frontend Container App points to the correct backend URL.*
