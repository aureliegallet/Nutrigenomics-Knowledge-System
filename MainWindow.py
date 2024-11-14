from PyQt6.QtWidgets import (
    QMainWindow, 
    QPushButton, 
    QLabel, 
    QVBoxLayout, 
    QWidget,
    QTabWidget
)
from PyQt6.QtCore import QSize, Qt
from WelcomeWidget import WelcomeWidget
from ExpertWidget import ExpertWidget


# Class MainWindow inherits from the Qt MainWindow
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set window 
        self.setWindowTitle("Knowledge Technology Practical")
        self.setFixedSize(QSize(800, 600))
        #self.setStyleSheet("background-color: blue;") 

        welcomeWidget = WelcomeWidget()
        expertWidget = ExpertWidget()

        tabs = QTabWidget()
        tabs.setTabPosition(QTabWidget.TabPosition.North)
        tabs.addTab(welcomeWidget, "Welcome")
        tabs.addTab(expertWidget, "Expert")

        
        self.setCentralWidget(tabs)


    