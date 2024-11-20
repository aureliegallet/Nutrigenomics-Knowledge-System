from PyQt6.QtWidgets import ( 
    QPushButton, 
    QLabel, 
    QVBoxLayout, 
    QWidget
)
from PyQt6.QtCore import Qt


# Class WelcomeWidget inherits from the Qt MainWindow
class WelcomeWidget(QWidget):
    def __init__(self):
        super().__init__()

        self.isChecked = False

        # Make text
        welcomeLabel = QLabel("Welcome to our knowledge system!")
        welcomeLabel.setAlignment(Qt.AlignmentFlag.AlignHCenter | Qt.AlignmentFlag.AlignVCenter) 
        # Note: we need to use the OR pipe to combine two alignment flags
        
        # Make button 
        self.button = QPushButton("Say Hello!")
        self.button.clicked.connect(self.the_button_was_clicked)
        self.button.setStyleSheet("""
            QPushButton {
                background-color: gray; 
            }
            QPushButton:hover {
                background-color: red; 
            }
        """)

        # Make layout
        layout = QVBoxLayout()
        layout.addWidget(welcomeLabel)
        layout.addWidget(self.button)
        self.setLayout(layout)

    def the_button_was_clicked(self):
        self.isChecked = not self.isChecked # inverts status
        if self.isChecked == True:
            self.button.setText("Say Goodbye!")
        else: 
            self.button.setText("Say Hello!")



    