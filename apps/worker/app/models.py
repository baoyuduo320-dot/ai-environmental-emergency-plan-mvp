from pydantic import BaseModel


class ProjectIntake(BaseModel):
    project_id: str
    company_name: str
    industry: str
    region: str
