from deps import get_current_user
from typing import Annotated, List, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, HTTPException, Response
from starlette import status
from models import Budget, LineItem
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

    class Config:
        orm_mode = True

class BudgetCreate(BaseModel):
    title: str
    description: str
    income: str

class BudgetUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    income: Optional[float] = None

class LineItemBase(BaseModel):
    title: str
    amount: float

    class Config:
        orm_mode = True

class LineItemCreate(LineItemBase):
    title: str
    amount: float

class LineItemUpdate(BaseModel):
    title: Optional[str] = None
    amount: Optional[float] = None

class BudgetWithLineItems(BudgetBase):
    line_items: List[LineItemBase] = []


db_dependency = Annotated[Session, Depends(get_db)]
user_dependency = Annotated[dict, Depends(get_current_user)]

@router.get('/', status_code=status.HTTP_200_OK, response_model=List[BudgetWithLineItems])
async def get_budgets(db: db_dependency):
    return db.query(Budget).all()

@router.get('/budget/{budget_id}', status_code=status.HTTP_200_OK, response_model=BudgetWithLineItems)
async def get_budget(db: db_dependency, user: user_dependency, budget_id: int):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user.get("id")).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    return db_budget

@router.post('/', status_code=status.HTTP_201_CREATED, response_model=BudgetBase)
async def create_budget(db: db_dependency, user: user_dependency, budget: BudgetCreate):
    db_budgets = Budget(**budget.model_dump(), user_id = user.get('id'))
    try:
        db.add(db_budgets)
        db.commit()
        db.refresh(db_budgets)
    except:
        db.rollback()
        raise
    return db_budgets

@router.post("/budget/{budget_id}/line-items", status_code=status.HTTP_201_CREATED, response_model=LineItemBase)
async def create_line_item(db: db_dependency, user: user_dependency, budget_id: int, line_item: LineItemCreate):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user.get("id")).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found.")

    db_item = LineItem(**line_item.model_dump(), budget_id=budget_id)
    try:
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
    except:
        db.rollback()
        raise
    return db_item

@router.put("/budget/{budget_id}", status_code=status.HTTP_200_OK, response_model=BudgetBase)
async def update_budget(db: db_dependency, user: user_dependency, budget: BudgetUpdate, budget_id: int):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user.get('id')).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    budget_update = budget.model_dump(exclude_unset=True)
    for key, value in budget_update.items():
        setattr(db_budget, key, value)
    db.commit()
    db.refresh(db_budget)
    return db_budget
    

@router.put("/line-items/{item_id}", status_code=status.HTTP_200_OK, response_model=LineItemBase)
async def update_line_item(db: db_dependency, user: user_dependency, item_id: int, line_item: LineItemUpdate):
    db_item = db.query(LineItem).join(Budget).filter(LineItem.id == item_id, Budget.user_id == user.get("id")).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Line item not found.")
    
    update_data = line_item.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_item, key, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item

@router.delete("/budget/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(db: db_dependency, user: user_dependency, budget_id: int):
    db_budget = db.query(Budget).filter(Budget.id == budget_id, Budget.user_id == user.get('id')).first()
    if not db_budget:
        raise HTTPException(status_code=404, detail="Budget not found.")
    db.delete(db_budget)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.delete("/line-items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_line_item(db: db_dependency, user: user_dependency, item_id: int):
    db_item = db.query(LineItem).join(Budget).filter(LineItem.id == item_id, Budget.user_id == user.get("id")).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Line item not found.")

    db.delete(db_item)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
