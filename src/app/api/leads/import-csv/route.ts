import { NextRequest, NextResponse } from 'next/server';
import { LeadManagementSystem, CSVMapping } from '../../../lib/lead-management/LeadManagementSystem';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('csvFile') as File;
    const sourceName = formData.get('sourceName') as string;
    const mapping = JSON.parse(formData.get('mapping') as string) as CSVMapping;

    if (!file) {
      return NextResponse.json(
        { error: 'No CSV file provided' },
        { status: 400 }
      );
    }

    if (!sourceName) {
      return NextResponse.json(
        { error: 'Source name is required' },
        { status: 400 }
      );
    }

    // Read CSV content
    const csvContent = await file.text();
    
    // Initialize lead management system
    const leadSystem = new LeadManagementSystem();
    
    // Create lead source
    const sourceId = `source_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Import leads
    const result = await leadSystem.importLeadsFromCSV(csvContent, sourceId, mapping);
    
    // Get analytics
    const analytics = leadSystem.getLeadAnalytics();
    
    return NextResponse.json({
      success: true,
      message: `Successfully imported ${result.imported} leads`,
      data: {
        imported: result.imported,
        errors: result.errors,
        analytics: analytics,
        sourceId: sourceId
      }
    });

  } catch (error) {
    console.error('CSV import error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to import CSV',
        details: error.message 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get sample CSV format and mapping options
    const sampleFormat = {
      headers: [
        'Company Name',
        'Contact Person',
        'Title',
        'Email',
        'Phone',
        'Address',
        'City',
        'State',
        'Zip Code',
        'Website',
        'Industry',
        'Company Size',
        'Revenue',
        'Last Contact',
        'Notes'
      ],
      sampleRow: [
        'Premier Real Estate Group',
        'John Smith',
        'Managing Partner',
        'john.smith@premierrealestate.com',
        '555-123-4567',
        '123 Main Street',
        'New York',
        'NY',
        '10001',
        'www.premierrealestate.com',
        'Real Estate',
        'Large',
        '$10M+',
        '2025-01-15',
        'Commercial properties focus'
      ]
    };

    const mappingOptions = {
      name: ['Contact Person', 'Name', 'Full Name', 'Contact Name'],
      company: ['Company Name', 'Company', 'Business Name', 'Organization'],
      industry: ['Industry', 'Business Type', 'Sector'],
      title: ['Title', 'Position', 'Job Title', 'Role'],
      email: ['Email', 'Email Address', 'Contact Email'],
      phone: ['Phone', 'Phone Number', 'Contact Phone', 'Telephone'],
      location: ['Address', 'Location', 'City', 'State', 'Zip Code']
    };

    return NextResponse.json({
      success: true,
      data: {
        sampleFormat,
        mappingOptions
      }
    });

  } catch (error) {
    console.error('Error getting CSV format:', error);
    return NextResponse.json(
      { error: 'Failed to get CSV format' },
      { status: 500 }
    );
  }
}
