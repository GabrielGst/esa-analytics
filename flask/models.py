from datetime import datetime
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Activity(db.Model):
    __tablename__ = "activities"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), default="activity")

    ssapId = db.Column(db.String(120), unique=True, nullable=False)
    Title = db.Column(db.String(255))
    country = db.Column(db.String(120))
    fundCode = db.Column(db.String(50))
    title0 = db.Column(db.String(255))
    status = db.Column(db.DateTime, default=datetime.utcnow)
    contractNumber = db.Column(db.String(100))
    supplierCode = db.Column(db.String(100))
    supplierName = db.Column(db.String(255))
    trls = db.Column(db.String(100))
    other = db.Column(db.String(255))
    yearAchievement = db.Column(db.Integer)
    submissionDate = db.Column(db.DateTime)
    submittedBy = db.Column(db.String(120))
    lastAuthor = db.Column(db.String(120))
    scheme = db.Column(db.String(255))

    # ARAP
    arap_PlannedStartTRL = db.Column(db.String(50))
    arap_PlannedEndTRL = db.Column(db.String(50))
    arap_Description = db.Column(db.Text)
    arap_StartofActivity = db.Column(db.String(100))
    arap_EED = db.Column(db.String(100))
    arap_ProspectforUse = db.Column(db.Text)
    arap_PerformanceofCompagny = db.Column(db.Text)
    arap_Note = db.Column(db.Text)
    arap_OverallAmount = db.Column(db.Integer)
    arap_lastModifiedOn = db.Column(db.String(100))

    # Editable
    description = db.Column(db.Text)
    author0 = db.Column(db.String(120))
    impact1 = db.Column(db.String(255))
    impact2 = db.Column(db.String(255))
    impact3 = db.Column(db.String(255))
    esaInternal = db.Column(db.Boolean, default=False)
    technicalOfficer = db.Column(db.String(120))

    def to_dict(self):
        result = {}
        for c in self.__table__.columns:
            value = getattr(self, c.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            result[c.name] = value
        return result


class Story(db.Model):
    __tablename__ = "stories"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    type = db.Column(db.String(50), default="story")

    ssapId = db.Column(db.String(120), unique=True, nullable=False)
    country = db.Column(db.String(120))
    fundCode = db.Column(db.String(50))
    status = db.Column(db.DateTime, default=datetime.utcnow)
    pptReport = db.Column(db.String(255))
    numberOfActivities = db.Column(db.Integer)
    supplierCode = db.Column(db.String(100))
    image = db.Column(db.String(255))
    compLogo = db.Column(db.String(255))
    trls = db.Column(db.String(100))
    other = db.Column(db.String(255))
    yearAchievement = db.Column(db.Integer)
    submissionDate = db.Column(db.DateTime)
    submittedBy = db.Column(db.String(120))
    lastAuthor = db.Column(db.String(120))
    lastModifiedOn = db.Column(db.String(100))
    childActivities = db.Column(db.String(255))

    # Editable
    Title = db.Column(db.String(255))
    storyDescription = db.Column(db.Text)
    storyAuthor = db.Column(db.String(120))
    esaInternal = db.Column(db.Boolean, default=False)
    storyStatus = db.Column(db.String(120))
    impact1 = db.Column(db.String(255))
    impact2 = db.Column(db.String(255))
    impact3 = db.Column(db.String(255))

    # Contract numbers
    contractNumber1 = db.Column(db.String(100))
    contractNumber2 = db.Column(db.String(100))
    contractNumber3 = db.Column(db.String(100))
    contractNumber4 = db.Column(db.String(100))
    contractNumber5 = db.Column(db.String(100))

    # Customers
    customers = db.Column(db.String(255))
    customer1 = db.Column(db.String(255))
    customer2 = db.Column(db.String(255))
    customer3 = db.Column(db.String(255))
    customer4 = db.Column(db.String(255))
    customer5 = db.Column(db.String(255))

    def to_dict(self):
        result = {}
        for c in self.__table__.columns:
            value = getattr(self, c.name)
            if isinstance(value, datetime):
                value = value.isoformat()
            result[c.name] = value
        # always compute from childActivities — stored column is stale
        child = self.childActivities or ''
        result['numberOfActivities'] = len([a for a in child.split(',') if a.strip()])
        return result
