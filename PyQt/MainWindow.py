from PyQt6.QtWidgets import (
    QMainWindow, 
    QVBoxLayout,
    QTabWidget,
    QLabel,
    QWidget,
)
from PyQt6.QtCore import QSize
from widgets.WelcomeWidget import WelcomeWidget
from widgets.ExpertWidget import ExpertWidget
from widgets.KnowledgeWidget import KnowledgeWidget
from widgets.SystemWidget import SystemWidget


# Class MainWindow inherits from the Qt MainWindow
class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()

        # Set window 
        self.setWindowTitle("Knowledge Technology Practical")
        self.setFixedSize(QSize(800, 600))
        # self.setStyleSheet("background-color: blue;") 

        # Tab Widgets
        welcomeWidget = WelcomeWidget()
        systemWidget = SystemWidget()
        expertWidget = ExpertWidget()
        knowledgeWidget = KnowledgeWidget()

        tabs = QTabWidget()
        tabs.setTabPosition(QTabWidget.TabPosition.North)
        tabs.addTab(welcomeWidget, "Welcome")
        tabs.addTab(systemWidget, "System")
        tabs.addTab(expertWidget, "Expert")
        tabs.addTab(knowledgeWidget, "Knowledge")    
        tabs.setStyleSheet("""
            QTabWidget::pane { 
                padding-top: 10px;
            }
        """)    

        # Layout
        layout = QVBoxLayout()
        layout.addWidget(tabs)


        # Main Widget
        mainWidget = QWidget()
        mainWidget.setLayout(layout)
        self.setCentralWidget(mainWidget)


    