# ClientView - Usage Guide

## 🚀 Quick Start (5 Minutes)

### Step 1: Upload Your PowerPoint
1. Go to homepage
2. Drag & drop your .pptx file (or click to browse)
3. Wait ~2 seconds for parsing

### Step 2: Review Detected Variables
Variables are automatically detected and grouped:
- **Names**: Client names, advisor names
- **Dates**: Meeting dates, report dates
- **Currency**: Portfolio values, fees
- **Percentages**: Allocations, returns
- **Numbers**: Any other numeric values

### Step 3: Edit Variables
1. Find the variable in the right panel
2. Type new value in the input field
3. See changes reflected in slide previews (left panel)

### Step 4: Download
1. Click "Download Edited Presentation"
2. File downloads as `[original_name]_edited.pptx`
3. Open in PowerPoint to verify changes

**Total Time**: ~5 minutes ✅

---

## 📖 Detailed Workflow

### Uploading Files

**Supported Formats**:
- ✅ .pptx (PowerPoint 2007+)
- ❌ .ppt (old format - not supported)
- ❌ .pdf, .key, .odp

**File Size Limit**: 50MB

**Best Practices**:
- Use consistent variable formats (e.g., always "Client:" before names)
- Keep slide text simple for better detection
- Use {{variable_name}} for guaranteed detection

---

### Variable Detection

#### Automatic Detection Patterns

1. **Names**
   ```
   Client: John Smith  → Detects "John Smith"
   Advisor: Jane Doe   → Detects "Jane Doe"
   ```

2. **Dates**
   ```
   Meeting Date: 1/15/2025      → Detects "1/15/2025"
   As of January 15, 2025       → Detects "January 15, 2025"
   ```

3. **Currency**
   ```
   Portfolio Value: $2,500,000  → Detects "$2,500,000"
   Fee: $18,750                 → Detects "$18,750"
   Assets: $2.5M               → Detects "$2.5M"
   ```

4. **Percentages**
   ```
   Allocation: 65%              → Detects "65%"
   Return: 12.5%                → Detects "12.5%"
   ```

5. **Template Variables**
   ```
   {{client_name}}              → Detects "client_name"
   {{portfolio_value}}          → Detects "portfolio_value"
   ```

#### Manual Variable Naming

For better control, use {{variable_name}} format:
```
Client: {{client_name}}
Date: {{meeting_date}}
Value: {{portfolio_value}}
```

---

### Editing Variables

#### Individual Editing
1. **Find Variable**: Scroll through grouped list
2. **Edit Value**: Type new value in input field
3. **Preview**: Changes shown in slide previews immediately
4. **Occurrence Count**: Shows how many times variable appears

#### Bulk Editing
All occurrences of a variable update together:
- Edit "client_name" once → Updates in all slides

#### Reset Changes
Click "Reset" button to revert all changes to original values

---

### Slide Categories

Slides are automatically categorized:

| Icon | Category | Common Content |
|------|----------|----------------|
| 📊 | Current Allocation | Existing portfolio breakdown |
| 🎯 | Target Allocation | Recommended allocation |
| 📈 | Performance | Returns, historical data |
| ⚖️ | Risk/Reward | Volatility, Sharpe ratio |
| ⏱️ | Pacing | Implementation timeline |
| 💵 | Fees | Cost structure |
| 📎 | Appendix | Additional resources |
| ⚠️ | Disclosures | Legal disclaimers |

---

### Exporting Presentations

#### Export Process
1. Click "Download Edited Presentation"
2. Server generates new .pptx file
3. File downloads automatically
4. Open in PowerPoint/Google Slides

#### File Naming
- **Original**: `client_proposal.pptx`
- **Exported**: `client_proposal_edited.pptx`

#### What's Preserved
- ✅ Slide order
- ✅ Text content
- ✅ Basic formatting
- ✅ Variable replacements

#### Current Limitations
- ⚠️ Complex shapes not preserved
- ⚠️ Images not included
- ⚠️ Charts not editable
- ⚠️ Advanced formatting simplified

---

## 💡 Tips & Tricks

### For Best Results

1. **Use Consistent Patterns**
   ```
   Good: Client Name: {{client_name}}
   Bad:  Client: John Smith (sometimes) / John (other times)
   ```

2. **Group Similar Variables**
   ```
   equity_allocation_current
   equity_allocation_target
   fixed_income_allocation_current
   fixed_income_allocation_target
   ```

3. **Use Descriptive Names**
   ```
   Good: portfolio_value_starting
   Bad:  val1
   ```

4. **Test with Small Files First**
   - Start with 5-10 slide deck
   - Verify detection works
   - Then use full presentations

### Common Issues

**Problem**: Variable not detected
- **Solution**: Use {{variable_name}} format

**Problem**: Wrong text detected as variable
- **Solution**: Edit manually after export in PowerPoint

**Problem**: Export looks different
- **Solution**: Advanced formatting not yet supported (Phase 2)

**Problem**: File too large
- **Solution**: Compress images, reduce to < 50MB

---

## 🎯 Example Workflows

### Scenario 1: Quarterly Client Review
```
1. Upload: Q4_Review_Template.pptx
2. Edit:
   - client_name: "Johnson Family Trust"
   - meeting_date: "January 15, 2025"
   - portfolio_value: "$3,200,000"
   - return_ytd: "11.5%"
3. Export: Q4_Review_Johnson.pptx
4. Time: 3 minutes
```

### Scenario 2: New Client Proposal
```
1. Upload: New_Client_Proposal_Template.pptx
2. Edit:
   - client_name: "Sarah Martinez"
   - recommended_allocation_equity: "60%"
   - recommended_allocation_fixed: "40%"
   - annual_fee: "$15,000"
3. Export: Proposal_Martinez.pptx
4. Time: 4 minutes
```

### Scenario 3: Annual Review (Multiple Clients)
```
1. Upload: Annual_Review_Template.pptx
2. Edit for Client 1 → Export
3. Click "Upload New File"
4. Upload same template
5. Edit for Client 2 → Export
6. Repeat for 10 clients
7. Total Time: 30 minutes (vs 5 hours manual)
```

---

## 🔐 Privacy & Security

- **Client-Side Parsing**: Files parsed in your browser
- **No Storage**: Files not saved on servers
- **Temporary Processing**: Server only processes during export
- **Automatic Cleanup**: Files removed after download
- **HTTPS**: All connections encrypted

---

## 📞 Getting Help

### Demo Mode
Not ready to upload files? Try the demo:
1. Click "View Template Library" on homepage
2. Explore with mock data
3. Click "Open Builder" to see editing interface

### Support
- Check console for detailed error messages
- Verify file format (.pptx only)
- Try with simpler presentation first
- Contact support with specific error messages

---

## 🎓 Learning Resources

### PowerPoint Template Best Practices
1. **Use Master Slides**: Consistent formatting
2. **Name Variables**: Use {{variable}} format
3. **Document Variables**: Keep a list
4. **Test Early**: Upload draft versions first
5. **Backup**: Keep original files

### Variable Naming Conventions
```
Format: category_specific_description

Examples:
- client_name_primary
- client_name_spouse
- portfolio_value_current
- portfolio_value_target
- allocation_equity_percent
- allocation_fixed_percent
- fee_annual_dollars
- fee_quarterly_dollars
```

---

## 📊 Feature Comparison

| Feature | Manual Editing | ClientView |
|---------|----------------|------------|
| Time per deck | 30-45 minutes | 3-5 minutes |
| Error rate | High (typos) | Low (automated) |
| Consistency | Variable | High |
| Bulk updates | Difficult | Easy |
| Learning curve | Low | Low |
| Cost | Free | Subscription |

---

**Ready to get started?** Upload your first PowerPoint file now! 🚀

