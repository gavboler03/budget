from deps import get_current_user
from typing import Annotated, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException
from starlette import status
from models import Budget
from database import SessionLocal

router = APIRouter(
    prefix='/budgets',
    tags=['budgets']
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class BudgetBase(BaseModel):
    title: str
    description: Optional[str]
    income: float
    balance: float

    class Config:
        orm_mode = True

class BudgetCreate(BaseModel):
    title: str
    description: str
    income: float
    balance: float

class BudgetUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    income: Optional[float] = None
    balance: Optional[float] = None


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/', status_code=status.HTTP_200_OK, response_model=List[BudgetBase])
async def get_budgets(db: db_dependency):
    return db.query(Budget).all()

@router.get('/budget/{budget_id}', status_code=status.HTTP_200_OK, response_model=BudgetBase)
async def get_budget(db: db_dependency, budget_id: int):
    db_budget = db.query(Budget).filter(Budget.id == budget_id).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    return db_budget

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=BudgetBase)
async def create_budget(db: db_dependency, user: user_dependency, budget: BudgetCreate):
    db_budgets = Budget(**budget.model_dump(), user_id = user.get('id'))
    db.add(db_budgets)
    db.commit()
    db.refresh(db_budgets)
    return db_budgets

@router.put("/budget/{budget_id}", status_code=status.HTTP_200_OK, response_model=BudgetBase)
async def update_budget(db: db_dependency, user: user_dependency, budget: BudgetUpdate, budget_id: int):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user.get('id')).first()
    if not budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    budget_update = budget.model_dump(exclude_unset=True)
    for key, value in budget_update.items():
        setattr(db_budget, key, value)
    db.commit()
    db.refresh(db_budget)
    return db_budget
    
    