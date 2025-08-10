from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    budgets = relationship(
        "Budget",
        back_populates="user",
        cascade="all, delete-orphan"
    )


class Budget(Base):
    __tablename__ = "budgets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    description = Column(String)
    income = Column(DECIMAL(precision=10, scale=2), nullable=False)
    balance = Column(DECIMAL(precision=10, scale=2), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="budgets")

    line_items = relationship(
        "LineItem",
        back_populates="budget",
        cascade="all, delete-orphan"
    )


class LineItem(Base):
    __tablename__ = "line_items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    price = Column(DECIMAL(precision=10, scale=2), nullable=False)
    budget_id = Column(Integer, ForeignKey("budgets.id"), nullable=False)

    budget = relationship("Budget", back_populates="line_items")
