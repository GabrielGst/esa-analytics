# populate_activities.py
import csv
from datetime import datetime
from index import create_app, db
from models import Activity

app = create_app()  # Make sure this uses your production config

CSV_FILE = 'data/activities_sample.csv'  # Path to your CSV file

with app.app_context():
    activities_to_add = []
    db.session.query(Activity).delete()
    db.session.commit()
    print('Clean up activity table from all activities.')

    with open(CSV_FILE, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        for row in reader:
            activity = Activity(
                type=row.get('type', 'activity'),
                ssapId=row['ssapId'],
                Title=row.get('Title'),
                country=row.get('country'),
                fundCode=row.get('fundCode'),
                title0=row.get('title0'),
                status=datetime.strptime(row['status'], "%m/%d/%Y, %I:%M:%S %p") if row.get('status') else None,
                contractNumber=row.get('contractNumber'),
                supplierCode=row.get('supplierCode'),
                supplierName=row.get('supplierName'),
                trls=row.get('trls'),
                other=row.get('other'),
                yearAchievement=int(row['yearAchievement']) if row.get('yearAchievement') else None,
                submissionDate=datetime.strptime(row['submissionDate'], "%m/%d/%Y, %I:%M:%S %p") if row.get('submissionDate') else None,
                submittedBy=row.get('submittedBy'),
                lastAuthor=row.get('lastAuthor'),
                scheme=row.get('scheme'),
                arap_PlannedStartTRL=row.get('arap_PlannedStartTRL'),
                arap_PlannedEndTRL=row.get('arap_PlannedEndTRL'),
                arap_Description=row.get('arap_Description'),
                arap_StartofActivity=row.get('arap_StartofActivity'),
                arap_EED=row.get('arap_EED'),
                arap_ProspectforUse=row.get('arap_ProspectforUse'),
                arap_PerformanceofCompagny=row.get('arap_PerformanceofCompagny'),
                arap_Note=row.get('arap_Note'),
                arap_OverallAmount=row.get('arap_OverallAmount'),
                arap_lastModifiedOn=row.get('arap_lastModifiedOn'),
                description=row.get('description'),
                author0=row.get('author0'),
                esaInternal=row.get('esaInternal', 'False').lower() == 'true',
                technicalOfficer=row.get('technicalOfficer')
            )

            activities_to_add.append(activity)

    if activities_to_add:
        db.session.bulk_save_objects(activities_to_add)
        db.session.commit()
        print(f"{len(activities_to_add)} activities imported successfully!")
    else:
        print("No new activities to add.")
